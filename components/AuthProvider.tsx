import Image from 'next/image'
import { FC } from 'react'

type Props = {
  googleSignIn: () => void
  twitterSignIn: () => void
  githubSignIn: () => void
}

export const AuthProvider: FC<Props> = ({
  googleSignIn,
  twitterSignIn,
  githubSignIn,
}) => {
  const PROVIDER_DATA = [
    {
      id: 1,
      name: 'Google',
      event: googleSignIn,
    },
    {
      id: 2,
      name: 'Twitter',
      event: twitterSignIn,
    },
    {
      id: 3,
      name: 'GitHub',
      event: githubSignIn,
    },
  ] as const

  return (
    <div className='flex justify-center items-center'>
      {PROVIDER_DATA.map((data) => {
        return (
          <div
            key={data.id}
            className='flex flex-col items-center px-4 xs:px-7 md:px-8 lg:px-10'
          >
            {data.name === 'GitHub' ? (
              <div className='relative w-16 h-16 rounded-full border border-dark-400 border-solid xs:w-20 xs:h-20'>
                <Image
                  src={`/${data.name}Logo.png`}
                  layout='fill'
                  alt={data.name}
                  priority
                  onClick={data.event}
                />
              </div>
            ) : (
              <div className='relative w-16 h-16 hover:cursor-pointer xs:w-20 xs:h-20'>
                <Image
                  src={`/${data.name}Logo.png`}
                  layout='fill'
                  alt={data.name}
                  priority
                  onClick={data.event}
                />
              </div>
            )}
            <div className='mt-2'>{data.name}</div>
          </div>
        )
      })}
    </div>
  )
}
