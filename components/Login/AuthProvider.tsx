import { FC } from 'react'
import { NextRouter } from 'next/router'
import Image from 'next/image'

type Props = { router: NextRouter }

export const AuthProvider: FC<Props> = ({ router }) => {
  const PROVIDER = ['Google', 'Twitter', 'GitHub'] as const

  return (
    // それぞれproviderのqueryを含んでauth-redirectに遷移するボタン
    <div className='flex justify-center items-center'>
      {PROVIDER.map((provider) => {
        return (
          <div
            key={provider}
            className='flex flex-col items-center px-4 xs:px-7 md:px-8 lg:px-10'
          >
            {/* GitHubの場合、ボタンの縁にborderをつける */}
            {provider === 'GitHub' ? (
              <div className='relative w-16 h-16 rounded-full border border-dark-400 border-solid xs:w-20 xs:h-20'>
                <Image
                  src={`/${provider}Logo.png`}
                  layout='fill'
                  alt={provider}
                  priority
                  // queryを渡すことで2回リダイレクトされなくなる
                  onClick={() =>
                    router.push({
                      pathname: `/auth-redirect`,
                      query: { provider: provider.toLowerCase() },
                    })
                  }
                />
              </div>
            ) : (
              <div className='relative w-16 h-16 hover:cursor-pointer xs:w-20 xs:h-20'>
                <Image
                  src={`/${provider}Logo.png`}
                  layout='fill'
                  alt={provider}
                  priority
                  // queryを渡すことで2回リダイレクトされなくなる
                  onClick={() =>
                    router.push({
                      pathname: `/auth-redirect`,
                      query: { provider: provider.toLowerCase() },
                    })
                  }
                />
              </div>
            )}
            <div className='mt-2'>{provider}</div>
          </div>
        )
      })}
    </div>
  )
}
