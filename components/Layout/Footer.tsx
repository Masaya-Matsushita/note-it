export const Footer = () => {
  return (
    <div className='flex flex-col-reverse justify-around items-center mt-20 h-56 bg-dark-700 xs:flex-row xs:h-40'>
      <div className='px-8 mt-6 space-y-1 text-xs text-dark-300 xs:mt-0'>
        <div className='font-bold'>推奨環境</div>
        <div>PC版 Google Chrome 最新版</div>
        <div>
          スマートフォン版 [iOS] Safari 最新版 / [Android] Google Chrome 最新版
        </div>
        <div>
          ※推奨環境以外でご覧いただいた場合、一部表示の崩れや機能が正常に動作しない場合があります。
        </div>
      </div>
      <div className='w-80 lg:mr-40'>
        <div className='text-xl text-center text-dark-300'>Note It</div>
        <div className='text-sm text-center text-dark-400'>
          (c) 2022 Matsushita Masaya
        </div>
      </div>
    </div>
  )
}
