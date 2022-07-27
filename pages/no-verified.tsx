import { ResendVerifyEmailModal } from 'components/Modal/ResendVerifyEmailModal'
import { SendEmailTroubleModal } from 'components/Modal/SendEmailTroubleModal'
import { NextPage } from 'next'
import { TitleWrapper } from 'components/Parts/TitleWrapper'
import { VerifyEmailDescription } from 'components/NoVerified/VerifyEmailDescription'

const NoVerified: NextPage = () => {
  return (
    <>
      <TitleWrapper
        title='メールアドレスが未認証です'
        subTitle='メールアドレスを認証する必要があります。'
      >
        <VerifyEmailDescription />
      </TitleWrapper>
      <div className='mx-4'>
        <SendEmailTroubleModal resendButton={true} />
        <ResendVerifyEmailModal />
      </div>
    </>
  )
}

export default NoVerified
