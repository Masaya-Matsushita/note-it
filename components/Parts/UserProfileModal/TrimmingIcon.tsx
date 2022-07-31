import { Button, Modal, Slider } from '@mantine/core'
import { ChangeEvent, Dispatch, FC, useCallback, useState } from 'react'
import Cropper, { Area, MediaSize } from 'react-easy-crop'
import { Plus } from 'tabler-icons-react'
import { UserProfileIconAction, UserProfileIconState } from '.'

type Props = {
  state: UserProfileIconState
  dispatch: Dispatch<UserProfileIconAction>
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

export const TrimmingIcon: FC<Props> = ({ state, dispatch }) => {
  const [imgSrc, setImgSrc] = useState('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [minZoom, setMinZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>()

  // 一辺200pxで1:1のトリミング領域
  const ASPECT_RATIO = 1
  const CROP_WIDTH = 200

  // 画像ファイルをアップロードしてモーダルに表示
  const onFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const reader = new FileReader()
        reader.addEventListener('load', () => {
          if (reader.result) {
            setImgSrc(reader.result.toString() || '')
            dispatch({ type: 'openTrim' })
          }
        })
        // 画像をBase64エンコード
        reader.readAsDataURL(e.target.files[0])
      }
    },
    [dispatch]
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
      const croppedImage = await getCroppedImg(imgSrc, croppedAreaPixels)
      dispatch({ type: 'croppedImgSrc', croppedImgSrc: croppedImage })
    } catch (e) {
      console.error(e)
    }
  }, [croppedAreaPixels, dispatch, imgSrc])

  return (
    <div>
      {/* 画像トリミング用モーダル */}
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
            image={imgSrc}
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
              { value: minZoom, label: '×1' },
              { value: minZoom + 1.5, label: '×2.5' },
              { value: minZoom + 3, label: '×4' },
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
      {/* ユーザーアイコン */}
      <div className='relative'>
        <img
          src={state.croppedImgSrc ? state.croppedImgSrc : state.iconURL}
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
  )
}
