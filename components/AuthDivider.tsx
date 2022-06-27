export const AuthDivider = (): JSX.Element => {
  return (
    // ログイン画面で使用される「------- OR ---------」
    <div className='flex items-center mt-12 mb-6 xs:mt-16 xs:mb-8 lg:mt-20 lg:mb-12'>
      <div className='grow ml-4 border border-dark-400 border-solid sm:ml-16 md:ml-24'></div>
      <span className='mx-4 text-lg text-dark-100 xs:mx-6'>OR</span>
      <div className='grow mr-4 border border-dark-400 border-solid sm:mr-16 md:mr-24'></div>
    </div>
  )
}
