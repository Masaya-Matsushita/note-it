import { Button } from '@mantine/core'
import { DevideLabel } from 'components/Parts/DevideLabel'
import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'

const ITEMS = [
  { id: '1', label: 'ジャンル別、本別で簡単整理' },
  { id: '2', label: '「自分が覚えたいところだけ」を保存' },
  { id: '3', label: '自分だけの括弧抜き文章で暗記効率UP' },
]

const Top: NextPage = () => {
  return (
    <>
      <div className='absolute top-[480px] left-0 -z-10 w-screen md:hidden md:h-[1800px]'>
        <Image src='/BG-1.png' alt='' layout='fill' />
      </div>
      <div className='hidden absolute top-[480px] left-0 -z-10 w-screen md:block md:h-[1800px]'>
        <Image src='/BG-2.png' alt='' layout='fill' />
      </div>
      <Link href='/login' passHref>
        <Button
          variant='outline'
          className='block mb-2 ml-auto w-28 xs:mr-8 xs:mb-12 md:mr-12 md:w-36 md:h-10'
        >
          ログイン
        </Button>
      </Link>
      <div className='flex flex-col xs:flex-row'>
        <div className='mt-8 mb-6 text-center xs:mt-24 xs:w-48 sm:ml-12 md:ml-20 md:w-60'>
          <div className='mb-2 text-4xl tracking-wider sm:mb-4 md:text-5xl'>
            Note It
          </div>
          <div className='xs:mb-16 xs:text-lg md:text-xl'>
            暗記特化型メモアプリ
          </div>
          <Link href='/login' passHref>
            <Button variant='light' className='hidden w-40 h-10 xs:inline'>
              使ってみる
            </Button>
          </Link>
        </div>
        <div className='relative mx-auto w-52 h-[410px] xxs:w-64 xxs:h-[500px]'>
          <Image
            src='/iphone-book1.png'
            alt='イメージ'
            layout='fill'
            priority
          />
        </div>
        <Link href='/login' passHref>
          <Button
            variant='light'
            className='block mx-auto mt-16 w-40 h-10 xxs:w-48 xs:hidden'
          >
            使ってみる
          </Button>
        </Link>
      </div>
      <h1 className='mt-32 mb-8 text-dark-200 sm:ml-4 md:ml-20'>
        「ピンポイントで大事なところだけ」
      </h1>
      <div className='mx-4 mb-40 max-w-2xl text-lg leading-7 text-dark-200 sm:mx-auto'>
        <div>
          受験勉強や資格の勉強、現代人は覚えることがたくさん。本も山積み。
        </div>
        <div>
          <div className='mt-4 ml-4 text-dark-300'>
            - あの内容を見返したい！でも、どこに書いてあったっけ？
          </div>
          <div className='mb-6 ml-4 text-dark-300'>
            - 付箋やマーカーだらけ、どこが大事か分かりづらい...
          </div>
        </div>
        <div className='mb-1'>
          もっと<span className='mx-1 font-bold text-blue-400'>賢く管理</span>
          してみませんか？
        </div>
        <div>
          Note It は「 ピンポイントで大事なところだけ 」
          <span className='mx-1 font-bold text-blue-400'>括弧抜き</span>
          で管理することで、あなたの復習を効率化、知識定着を支援するアプリです。
        </div>
      </div>
      <DevideLabel>
        <span className='mx-4 text-4xl tracking-wider text-dark-100 xs:mx-6'>
          Features
        </span>
      </DevideLabel>
      <div className='text-center'>サービスの特徴</div>
      <div className='flex flex-col items-center my-12 xs:flex-row xs:flex-wrap xs:justify-center'>
        {ITEMS.map((item) => {
          return (
            <div key={item.id} className='my-8 mx-4'>
              <div className='relative w-72 h-72 xs:w-[282px] xs:h-[282px]'>
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
      <Link href='/login' passHref>
        <Button
          variant='light'
          className='block mx-auto mt-48 mb-8 w-5/6 h-12 xs:w-96'
        >
          使ってみる ( ログイン画面へ )
        </Button>
      </Link>
    </>
  )
}

export default Top
