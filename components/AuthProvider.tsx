import Image from 'next/image'
import { useRouter } from 'next/router'

export const AuthProvider = () => {
  const router = useRouter()
  const PROVIDER_DATA = [
    {
      id: 1,
      name: 'Google',
      path: 'google',
    },
    {
      id: 2,
      name: 'Twitter',
      path: 'twitter',
    },
    {
      id: 3,
      name: 'GitHub',
      path: 'github',
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
                  // queryを渡すことで2回リダイレクトされなくなる
                  onClick={() =>
                    router.push({
                      pathname: `/auth-redirect`,
                      query: { provider: data.path },
                    })
                  }
                />
              </div>
            ) : (
              <div className='relative w-16 h-16 hover:cursor-pointer xs:w-20 xs:h-20'>
                <Image
                  src={`/${data.name}Logo.png`}
                  layout='fill'
                  alt={data.name}
                  priority
                  // queryを渡すことで2回リダイレクトされなくなる
                  onClick={() =>
                    router.push({
                      pathname: `/auth-redirect`,
                      query: { provider: data.path },
                    })
                  }
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
