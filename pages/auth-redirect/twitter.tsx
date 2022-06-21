import { LoadingOverlay } from '@mantine/core'
import { getRedirectResult, signInWithRedirect, UserCredential } from 'firebase/auth'
import { auth, twitterProvider } from 'firebaseConfig/firebase'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

const AuthRedirectWithTwitter: NextPage = () => {
  const router = useRouter()

  const redirectToMypage = async (): Promise<void> => {
    try {
      const result: UserCredential | null = await getRedirectResult(auth)
      if (result) {
        const user = result.user
        router.push(`/my-page/${user.uid}`)
      } else {
        signInWithRedirect(auth, twitterProvider)
      }
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message
        console.log(errorMessage)
        router.push('/login')
      }
    }
  }

  redirectToMypage()

  return <LoadingOverlay visible={true} loaderProps={{ size: 'xl' }} />
}

export default AuthRedirectWithTwitter
