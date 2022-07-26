import { Button } from '@mantine/core'
import { FC } from 'react'
import { AiOutlineDatabase } from 'react-icons/ai'

type Props = {
  label: string
  loading: boolean
}

export const LoginButton: FC<Props> = ({ label, loading }) => {
  return (
    <Button
      type='submit'
      size='md'
      loading={loading}
      leftIcon={<AiOutlineDatabase />}
      className='block mx-auto mt-8 w-full xs:mt-6 xs:mr-0 xs:ml-auto xs:w-40 xs:h-12'
    >
      {label}
    </Button>
  )
}
