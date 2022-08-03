import { DevideLabel } from 'components/Parts/DevideLabel'
import { FC } from 'react'

type Props = { label: string }

export const AuthDivider: FC<Props> = ({ label }) => {
  return (
    <div>
      <DevideLabel>
        <span className='mx-4 text-lg text-dark-100 xs:mx-6'>OR</span>
      </DevideLabel>
      <div className='flex justify-center items-center mb-6 xxs:text-lg xs:mb-10 lg:mb-12 lg:text-xl'>
        <div className=''>お持ちのアカウントで</div>
        <div className='ml-1 font-bold text-blue-400'>{label}</div>
      </div>
    </div>
  )
}
