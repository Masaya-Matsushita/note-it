import { Button } from '@mantine/core'
import { NextPage } from 'next'
import Image from 'next/image'

const Top: NextPage = () => {
  return (
    <>
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
        <div className='relative mx-auto w-52 h-[430px] xxs:w-64 xxs:h-[520px]'>
          <Image
            src='/iphone-book1.png'
            alt='イメージ図'
            layout='fill'
            priority
          />
        </div>
      </div>
      <div>
        <h1>「ピンポイントで大事なところだけ」</h1>
        <div>
          受験勉強や資格の勉強、現代人は覚えることがたくさん。本も山積み。
        </div>
        <div>
          「あの内容を復習したい！でも、どこに書いてあったっけ？」
          探し出すことにも一苦労。
        </div>
        <div>もっと賢く管理してみませんか？</div>
        <div>
          Note
          Itは「ピンポイントで大事なところだけ」を管理することで、あなたの復習を効率化、知識定着を支援するアプリです。
        </div>
      </div>
      <h1>Features</h1>
      {/* <div>サービスの特徴</div> */}
      <ol>
        <li>
          <div>ジャンル別、本別で簡単整理</div>
        </li>
        <li>「自分が覚えたいところだけ」を保存</li>
        <li>自分だけの括弧抜き文章で暗記効率UP</li>
      </ol>
    </>
  )
}

export default Top
