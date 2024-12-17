import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/component'
import styles from './LoginForm.module.css'
import Link from 'next/link'
import ToastNotification from '@/components/ToastNotification'

export default function LoginWithUsername({ logIn, updateLoginOption}) {
  const router = useRouter()
  const supabase = createClient()

  const [data, setData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false )

  // Toast State
  const toastRef = useRef(null);
  const [toastMessage, setToastMessage] = useState('')
  const [toastTitle, setToastTitle] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data: dataUser, error: signInError } = await supabase
      .auth
      .signInWithPassword({
          email: data?.email.trim(),
          password: data?.password.trim()
        })

        if(dataUser.user) {

          setError(null)
          setSuccess(true)
          toastRef.current.triggerToast()
          setToastTitle('Login Successful')
          setToastMessage('Redirecting to home page')

          setTimeout(() => {
            setSuccess(false)
            router.push('/home')
          }
          , 1000)

          setTimeout(() => {
            setToastTitle('')
            setToastMessage('')
          }
          , 3000)
        }
      if (signInError) throw signInError
    } catch (err) {
      setError(err.message)
    }
  }


  return (
    <div className={styles.loginForm__wrap}>
        <ToastNotification ref={toastRef} title={toastTitle} message={toastMessage}/>
      <div className={styles.loginForm__header}>
        <h1 className={styles.loginForm__title}>Sign in to your account</h1>
      </div>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className="form__row">
          <label className="form__label" htmlFor="email">Email:</label>
          <input
            className="form__input"
            id="email"
            type="email" 
            value={data?.email} 
            placeholder='Your email'
            autoComplete='email'
            onChange={(e) => setData({...data, email: e.target.value})} 
          />
        </div>
        <div className="form__row">
          <label className="form__label" htmlFor="password">Password:</label>
          <input
            className="form__input"
            id="password"
            type="password" 
            value={data?.password} 
            placeholder='Your password'
            onChange={(e) => setData({...data, password: e.target.value})} 
          />
        </div>
        {error && <p className="input__error">{`${error} !`}</p>}
        <button type="submit" className={styles.loginBtn}>
          Sign in
        </button>
        <div className={`${styles.login__link} txt-medium`} onClick={() => updateLoginOption('email')}>
            Sign in with login link instead
        </div>
      </form>
      <p className={styles.login__text}>Don't have an account? <Link href="/login?id=signup" className={styles.login__link}>Sign Up</Link> </p>
    </div>
  )
}