import { UserIcon } from './UserIcon'

export const Header = () => {
  return (
    <div>
      <div className='flex justify-between items-center mb-4 h-20 bg-dark-700 sm:h-24'>
        <div className='ml-6 text-2xl text-dark-100 no-underline sm:ml-12 sm:text-3xl'>
          Note It
        </div>
        <UserIcon />
      </div>
    </div>
  )
}
