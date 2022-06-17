import { NextPage } from 'next'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { app } from 'firebaseConfig/firebase'
import { ChangeEventHandler, ComponentProps, useState } from 'react'

const SignUp: NextPage = () => {
  const auth = getAuth(app)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit: ComponentProps<'form'>['onSubmit'] = async (e) => {
    e.preventDefault()
    await createUserWithEmailAndPassword(auth, email, password)
  }

  const handleChangeEmail: ChangeEventHandler<HTMLInputElement> = (e) => {
    setEmail(e.target.value)
  }

  const handleChangePassword: ChangeEventHandler<HTMLInputElement> = (e) => {
    setPassword(e.target.value)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='メールアドレス'
          value={email}
          onChange={handleChangeEmail}
        />
        <input
          type='text'
          placeholder='パスワード'
          value={password}
          onChange={handleChangePassword}
        />
        <button>登録</button>
      </form>
    </div>
  )
}

export default SignUp
