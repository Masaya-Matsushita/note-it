import { Button } from '@mantine/core'
import { FC, memo } from 'react'

type Props = {
  resendButton: boolean
  error: string
  handleSendEmail: any
}

// eslint-disable-next-line react/display-name
export const ResendButton: FC<Props> = memo(
  ({ resendButton, error, handleSendEmail }) => {
    if (!resendButton) {
      return (
        <div className='mt-8 text-right'>確認後、もう一度お試しください。</div>
      )
    }
    return (
      <div>
        <div className='grow mt-16 mb-4 border border-dark-500 border-solid'></div>
        <div>
          上記で解決しない場合、認証メールを再送信することもできます。（古いメールのリンクは無効になります）
        </div>
        {error ? (
          <div className='mt-2 text-sm font-bold text-red-500'>
            エラーが発生しました。しばらく時間をおいてお試しください。
          </div>
        ) : null}
        <Button
          onClick={handleSendEmail}
          className='block px-6 mt-2 mr-2 ml-auto'
        >
          再送信
        </Button>
      </div>
    )
  }
)
