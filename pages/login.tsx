import { AuthProvider } from 'components/Login/AuthProvider'
import { NextPage } from 'next'
import { Tabs } from '@mantine/core'
import { AuthDivider } from 'components/Login/AuthDivider'
import { SignInForm } from 'components/Login/SignInForm'
import { SignUpForm } from 'components/Login/SignUpForm'

const LABELS = ['ログイン', '新規登録'] as const

const Login: NextPage = () => {
  return (
    <>
      <Tabs
        className='pt-8 focus:outline-none sm:mx-8 md:mx-24'
        tabPadding='xl'
      >
        {LABELS.map((label) => {
          return (
            <Tabs.Tab
              key={label}
              label={label}
              className='px-4 pb-2 text-xl font-bold text-dark-300 xxs:text-2xl sm:px-6 md:px-8'
            >
              {label === 'ログイン' ? (
                <SignInForm label={label} />
              ) : (
                <SignUpForm label={label} />
              )}
              <AuthDivider label={label} />
            </Tabs.Tab>
          )
        })}
      </Tabs>
      <AuthProvider />
    </>
  )
}

export default Login
