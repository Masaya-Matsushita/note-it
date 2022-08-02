import { Popover } from '@mantine/core'
import { FC, ReactNode, useState } from 'react'
import { BiHelpCircle } from 'react-icons/bi'

type Props = {
  label: string
  children: ReactNode | string
}

export const InfoPopover: FC<Props> = ({ label, children }) => {
  const [popover, setPopover] = useState(false)

  return (
    <div className='flex justify-end'>
      <Popover
        opened={popover}
        onClose={() => setPopover(false)}
        trapFocus={false}
        target={
          <div
            onMouseEnter={() => setPopover(true)}
            onMouseLeave={() => setPopover(false)}
            className='flex items-center text-dark-300 underline hover:cursor-pointer'
          >
            <BiHelpCircle size={22} />
            <div>{label}</div>
          </div>
        }
        width={280}
        placement='end'
        position='top'
        className='mt-12'
        classNames={{
          popover: 'border-dark-500 border-solid',
        }}
        withArrow
      >
        {children}
      </Popover>
    </div>
  )
}
