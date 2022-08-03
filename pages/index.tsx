import { Button } from '@mantine/core'
import { DevideLabel } from 'components/Parts/DevideLabel'
import { NextPage } from 'next'
import Image from 'next/image'

const ITEMS = [
  { id: '1', label: 'ジャンル別、本別で簡単整理' },
  { id: '2', label: '「自分が覚えたいところだけ」を保存' },
  { id: '3', label: '自分だけの括弧抜き文章で暗記効率UP' },
]

const Top: NextPage = () => {
  return (
    <>
      <div className='absolute top-[500px] left-0 -z-10 w-screen h-[3000px]'>
        <Image src='/BG-1.png' alt='' layout='fill' />
      </div>
      <Button variant='outline' className='block mb-2 ml-auto w-28 xs:mb-12'>
        ログイン
      </Button>
      <div className='flex flex-col xs: xs:flex-row'>
        <div className='mb-6 text-center xs:mt-12 xs:w-48 sm:ml-12 md:ml-20 md:w-60'>
          <div className='my-4 text-4xl xs:tracking-wide md:text-5xl'>
            Note It
          </div>
          <div className='xs:mb-16 xs:text-lg md:text-xl'>
            暗記特化型メモアプリ
          </div>
          <Button variant='light' className='hidden w-40 h-10 xs:inline'>
            使ってみる
          </Button>
        </div>
        <div className='relative mx-auto w-52 h-[430px] xxs:w-64 xxs:h-[500px]'>
          <Image
            src='/iphone-book1.png'
            alt='イメージ'
            layout='fill'
            priority
          />
        </div>
        <div className='mx-8 mt-8'>
          <Button variant='light' className='w-full h-10 xs:hidden'>
            使ってみる
          </Button>
        </div>
      </div>
      <h1 className='mt-32'>「ピンポイントで大事なところだけ」</h1>
      <div className='mx-auto max-w-xl'>
        <div>
          受験勉強や資格の勉強、現代人は覚えることがたくさん。本も山積み。
        </div>
        <ul>
          <li>あの内容を見返したい！でも、どこに書いてあったっけ？</li>
          <li>マーカーだらけで読みづらい...</li>
        </ul>
        <div>もっと賢く管理してみませんか？</div>
        <div>
          Note
          Itは「ピンポイントで大事なところだけ」括弧抜きで管理することで、あなたの復習を効率化、知識定着を支援するアプリです。
        </div>
      </div>
      <DevideLabel>
        <span className='mx-4 text-4xl tracking-wider text-dark-100 xs:mx-6'>
          Features
        </span>
      </DevideLabel>
      <div className='text-center'>サービスの特徴</div>
      <div className='flex flex-col items-center my-8 xs:flex-row xs:flex-wrap xs:justify-center'>
        {ITEMS.map((item) => {
          return (
            <div key={item.id} className='my-8 mx-4'>
              <div className='relative w-72 h-72 xs:w-[296px] xs:h-[296px]'>
                <div className='text-4xl font-bold text-dark-300'>
                  {item.id}
                </div>
                <Image
                  src={`/Group-${item.id}.png`}
                  alt={`イメージ${item.id}`}
                  layout='fill'
                />
              </div>
              <div className='mt-6 font-bold tracking-wide text-center text-dark-200'>
                {item.label}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Top
