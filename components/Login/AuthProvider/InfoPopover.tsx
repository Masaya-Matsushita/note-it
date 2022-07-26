import { Popover } from '@mantine/core'
import { useState } from 'react'
import { BiHelpCircle } from 'react-icons/bi'

export const InfoPopover = () => {
  const [popover, setPopover] = useState(false)

  return (
    <Popover
      opened={popover}
      onClose={() => setPopover(false)}
      trapFocus={false}
      target={
        <div
          onMouseEnter={() => setPopover(true)}
          onMouseLeave={() => setPopover(false)}
          className='flex justify-end items-center mx-auto mt-12 max-w-[550px] text-dark-200 underline hover:cursor-pointer'
        >
          <BiHelpCircle size={22} />
          <div>サードパーティ認証について</div>
        </div>
      }
      width={280}
      placement='end'
      position='top'
      className='block text-right xs:ml-56 sm:ml-72 md:ml-96'
      classNames={{
        popover: 'border-dark-500 border-solid',
      }}
      withArrow
    >
      Google,Twitter,GitHubアカウントからユーザーを作成できます。プライベートモードのブラウザではご利用いただけません。
    </Popover>
  )
}
