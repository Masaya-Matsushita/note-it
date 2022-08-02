import { NextPage } from 'next'
import { TitleWrapper } from 'components/Parts/TitleWrapper'
import { EmailForm } from 'components/ForgotPassword/EmailForm'

const ForgotPassword: NextPage = () => {
  return (
    <>
      <TitleWrapper
        title='パスワード再設定'
        subTitle='パスワード再設定のリンクを送信します。メールアドレスをご入力ください。'
      >
        <EmailForm />
      </TitleWrapper>
    </>
  )
}

export default ForgotPassword
