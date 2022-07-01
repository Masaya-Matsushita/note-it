import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import db, { auth } from 'firebaseConfig/firebase'
import {useEffect, useState } from 'react'

export const Header = () => {
  const [userIcon, setUserIcon] = useState('')

  const getUserIcon = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docSnap = await getDoc(doc(db, 'users', user.uid))
        if (docSnap.exists()) {
          setUserIcon(docSnap.data().iconURL)
        }
      } else {
        setUserIcon('')
      }
    })
  }

  useEffect(() => {
    getUserIcon()
  }, [])

  return (
    <div className='flex justify-between p-4 bg-dark-700'>
      <div className='text-2xl'>Note It</div>
      {userIcon ? (
        <img
          src={userIcon}
          alt='userIcon'
          className='w-10 h-10 rounded-full sm:w-12 sm:h-12'
        />
      ) : null}
    </div>
  )
}
