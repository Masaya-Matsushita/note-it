import { LoadingOverlay } from '@mantine/core'
import { getRedirectResult, signInWithRedirect } from 'firebase/auth'
import { auth, googleProvider } from 'firebaseConfig/firebase'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

const AuthRedirectWithGoogle: NextPage = () => {
  const router = useRouter()

  const redirectToMypage = async (): Promise<void> => {
    try {
      const result = await getRedirectResult(auth)
      if (result) {
        const user = result.user
        router.push(`/my-page/${user.uid}`)
      } else {
        signInWithRedirect(auth, googleProvider)
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

export default AuthRedirectWithGoogle
