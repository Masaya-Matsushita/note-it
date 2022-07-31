import {
  ChangeEvent,
  Dispatch,
  FC,
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import db, { auth, storage } from 'firebaseConfig/firebase'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import Cropper, { Area, MediaSize } from 'react-easy-crop'
import { Button, Card, Modal, Slider, TextInput } from '@mantine/core'
import { Plus } from 'tabler-icons-react'
import { useRouter } from 'next/router'
import { Reducer, useReducer } from 'react'

type Props = {
  opened: boolean
  propsDispatch: Dispatch<any>
}

type State = typeof initialState

type Action = {
  type: 'icon' | 'name' | 'error' | 'display' | 'trimOpened' | 'closeTrim'
} & Partial<State>

const initialState = {
  error: '',
  iconURL: '',
  userName: '',
  trimOpened: false,
}

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'icon': {
      return {
        ...state,
        iconURL: action.iconURL ?? '',
      }
    }
    case 'name': {
      return {
        ...state,
        userName: action.userName ?? '',
      }
    }
    case 'display': {
      return {
        ...state,
        iconURL: action.iconURL ?? '',
        userName: action.userName ?? '',
      }
    }
    case 'error': {
      return {
        ...state,
        error: action.error ?? '',
      }
    }
    case 'trimOpened': {
      return {
        ...state,
        iconURL: action.iconURL ?? '',
        trimOpened: true,
      }
    }
    case 'closeTrim': {
      return {
        ...state,
        trimOpened: false,
      }
    }
  }
}

// urlをもとにimage要素を作成
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    // CodeSandboxでCORSエラーを回避するために必要
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

// 画像トリミングを行い新たな画像urlを作成
const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area
): Promise<string> => {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return ''
  }
  // canvasサイズを設定
  canvas.width = image.width
  canvas.height = image.height
  // canvas上に画像を描画
  ctx.drawImage(image, 0, 0)
  // トリミング後の画像を抽出
  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  )
  // canvasのサイズ指定(切り取り後の画像サイズに更新)
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
  // 抽出した画像データをcanvasの左隅に貼り付け
  ctx.putImageData(data, 0, 0)

  // canvasを画像(Base64)に変換
  return canvas.toDataURL('image/jpeg')
}

// eslint-disable-next-line react/display-name
export const UserProfileModal: FC<Props> = memo(({ opened, propsDispatch }) => {
  const router = useRouter()
  const uid = String(router.query.uid)
  const [state, dispatch] = useReducer(reducer, initialState)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [minZoom, setMinZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>()
  const [croppedImgSrc, setCroppedImgSrc] = useState('')

  // userのドキュメントを作成/更新、リロード
  const setUserProfile = useCallback(async () => {
    if (state.userName && state.userName.length <= 20) {
      // Storageへアイコン画像(Base64)を保存
      const iconUsersRef = ref(storage, `users/${uid}/icon`)
      await uploadString(iconUsersRef, croppedImgSrc, 'data_url')
      // 保存した画像のパスを取得、ユーザーネームと共にFirestoreへ保存
      const iconUrl = await getDownloadURL(iconUsersRef)
      await setDoc(doc(db, 'users', uid), {
        userName: state.userName,
        iconURL: iconUrl,
      })
      propsDispatch({ type: 'opened', opened: false })
      location.reload()
    } else {
      dispatch({ type: 'error', error: 'username error' })
    }
  }, [propsDispatch, croppedImgSrc, uid, state.userName])

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docSnap = await getDoc(doc(db, 'users', user.uid))
        if (docSnap.exists()) {
          // 更新の場合は現在のプロフィールを表示
          dispatch({
            type: 'display',
            iconURL: docSnap.data().iconURL,
            userName: docSnap.data().userName,
          })
        } else {
          // 新規作成の場合はデフォルトを表示
          dispatch({ type: 'icon', iconURL: '/UnknownIcon.png' })
          if (user.displayName) {
            dispatch({ type: 'name', userName: user.displayName })
          }
        }
      }
    })
  }, [])

  const ASPECT_RATIO = 1
  const CROP_WIDTH = 200

  // 画像ファイルをアップロードしてモーダルに表示
  const onFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const reader = new FileReader()
        reader.addEventListener('load', () => {
          if (reader.result) {
            dispatch({
              type: 'trimOpened',
              iconURL: reader.result.toString() || '',
              trimOpened: true,
            })
          }
        })
        reader.readAsDataURL(e.target.files[0])
      }
    },
    [propsDispatch]
  )

  // 画像のZoomデフォルト値を設定
  const onMediaLoaded = useCallback((mediaSize: MediaSize) => {
    const { width, height } = mediaSize
    const mediaAspectRadio = width / height
    // 画像のアスペクト比が大きい(画像が横長)の場合
    if (mediaAspectRadio > ASPECT_RATIO) {
      // 縦幅に合わせてZoomのデフォルト値を指定
      const result = CROP_WIDTH / ASPECT_RATIO / height
      setZoom(result)
      setMinZoom(result)
      return
    }
    // 横幅に合わせてZoomのデフォルト値を指定
    const result = CROP_WIDTH / width
    setZoom(result)
    setMinZoom(result)
  }, [])

  // 画像の切り取り情報を更新
  // ユーザーが画像の移動やZoomの操作をやめたときに呼ばれる
  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    []
  )

  // 切り取った画像のプレビューを表示
  const showCroppedImage = useCallback(async () => {
    if (!croppedAreaPixels) return
    try {
      const croppedImage = await getCroppedImg(state.iconURL, croppedAreaPixels)
      setCroppedImgSrc(croppedImage)
      // setTrimOpened(false)
      dispatch({ type: 'closeTrim' })
    } catch (e) {
      console.error(e)
    }
  }, [croppedAreaPixels, propsDispatch, state.iconURL])

  return (
    <Modal
      opened={opened}
      onClose={() => propsDispatch({ type: 'opened', opened: false })}
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
      className='mx-2 mt-16'
    >
      <div className='mt-4 mb-6 text-xl text-center'>
        アイコンと名前を設定してください。
      </div>
      <Card className='flex flex-col items-center mx-16'>
        <div>
          <Modal
            opened={state.trimOpened}
            onClose={() => dispatch({ type: 'closeTrim' })}
            closeOnClickOutside={false}
            closeOnEscape={false}
            withCloseButton={false}
            className='mx-2 mt-16'
          >
            <div className='relative h-[220px] bg-dark-100'>
              <Cropper
                image={state.iconURL}
                crop={crop}
                zoom={zoom}
                minZoom={minZoom}
                maxZoom={minZoom + 3}
                aspect={ASPECT_RATIO}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropSize={{
                  width: CROP_WIDTH,
                  height: CROP_WIDTH / ASPECT_RATIO,
                }}
                onMediaLoaded={onMediaLoaded}
                showGrid={false}
                cropShape='round'
              />
            </div>
            <div className='mx-8 mt-4'>
              <div className='ml-1'>Zoom</div>
              <Slider
                size='lg'
                value={zoom}
                onChange={setZoom}
                min={minZoom}
                max={minZoom + 3}
                step={0.1}
                label={null}
                marks={[
                  { value: 0.9, label: '×1' },
                  { value: 2.45, label: '×2.5' },
                  { value: 3.9, label: '×4' },
                ]}
              />
            </div>
            <div className='flex justify-between mt-12'>
              <Button
                color='red'
                onClick={() => dispatch({ type: 'closeTrim' })}
                className='ml-4 w-28 h-10 xs:ml-8 xs:w-36'
              >
                Cancel
              </Button>
              <Button
                onClick={showCroppedImage}
                className='mr-4 w-28 h-10 xs:mr-8 xs:w-36'
              >
                OK
              </Button>
            </div>
          </Modal>
          <div className='relative'>
            <img
              src={croppedImgSrc ? croppedImgSrc : state.iconURL}
              alt='アイコンの描画に失敗しました。'
              className='w-20 h-20 rounded-full sm:w-24 sm:h-24'
            />
            <label htmlFor='iconURL' className='absolute left-14 sm:left-16'>
              <input
                id='iconURL'
                type='file'
                accept='image/*,.png,.jpg,.jpeg,.gif'
                onChange={(e) => onFileChange(e)}
                className='hidden'
              />
              <div className='flex justify-center items-center w-6 h-6 bg-blue-500 rounded-full sm:w-8 sm:h-8'>
                <Plus size={20} strokeWidth={3} color={'white'} />
              </div>
            </label>
          </div>
        </div>
        <TextInput
          placeholder='User Name'
          value={state.userName}
          onChange={(e) =>
            dispatch({ type: 'name', userName: e.currentTarget.value })
          }
          className='mt-4'
        />
      </Card>
      {state.error ? (
        <div className='mt-2 text-sm font-bold text-center text-red-500'>
          {state.error === 'username error'
            ? 'ユーザーネームは1~20字で入力してください。'
            : 'エラーが発生しました。入力内容をご確認ください。(画像サイズは最大5MBです'}
        </div>
      ) : null}
      <Button onClick={setUserProfile} className='block mx-auto mt-8 w-48'>
        完了
      </Button>
    </Modal>
  )
})
