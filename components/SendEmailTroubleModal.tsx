import { Modal } from '@mantine/core'
import { useState } from 'react'
import { BiHelpCircle } from 'react-icons/bi'

export const SendEmailTroubleModal = (): JSX.Element => {
  const [opened, setOpened] = useState(false)

  return (
    <div className='flex justify-end items-center mt-6 xs:mt-4'>
      <BiHelpCircle />
      <span
        className='text-sm underline hover:cursor-pointer xs:text-base'
        onClick={() => setOpened(true)}
      >
        メールが届かない場合
      </span>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        withCloseButton={false}
      >
        <div className='mb-2 ml-2 text-xl'>主な考えられる原因</div>
        <div className='grow mb-2 border border-dark-400 border-solid'></div>
        <ol className='space-y-1'>
          <li> 迷惑メールフォルダに振り分けされてしまっている</li>
          <li>入力したメールアドレスが間違っている</li>
          <li>受信トレイの空き容量が不足している</li>
          <li>インターネット接続が不安定である</li>
        </ol>
        <div className='mt-8 text-right'>確認後、もう一度お試しください。</div>
      </Modal>
    </div>
  )
}
