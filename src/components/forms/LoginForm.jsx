import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/component'
import styles from './LoginForm.module.css'
import Link from 'next/link'
import Script from 'next/script'
import GoogleSignInButton from '../GoogleSignInButton'

export default function LoginForm({ updateLoginOption }) {
  const router = useRouter()
  const supabase = createClient()

  const [data, setData] = useState({
    email: ''
  })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false )

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const redirectUrl = process.env.NODE_ENV === 'development'
      ? process.env.NEXT_PUBLIC_DEV_REDIRECT_URL
      : process.env.NEXT_PUBLIC_PROD_REDIRECT_URL;

      const { data: dataUser, error: signInError } = await supabase
      .auth
      .signInWithOtp({
         email: data.email,
         options: {
          shouldCreateUser: false,
          emailRedirectTo: redirectUrl
          // emailRedirectTo: 'http://localhost:3000/home'
         }
        })

        if(dataUser) {
          setSuccess(true)
        }
      if (signInError) throw signInError
    } catch (err) {
      setError(err.message)
    }
  }


  async function handleSignInWithGoogle(response) {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: response.credential,
    })
  }
 

    // Keep global callback for Google's library
    useEffect(() => {
      window.handleSignInWithGoogle = async (response) => {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: response.credential,
        })
        if (error) {
          console.error(error)
          setError(error.message)
        } else {
          router.push('/home')
        }
      }
  
      return () => {
        delete window.handleSignInWithGoogle
      }
    }, [router, supabase.auth])



  return (
    <>
    <Script src="https://accounts.google.com/gsi/client" async/>
    <div className={styles.loginForm__wrap}>
      <div className={styles.loginForm__header}>
        <h1 className={styles.loginForm__title}>Sign in with Magic Link</h1>
        <p>
          Enter your email and we&apos;ll send you a link to sign in with.
        </p>
      </div>
      {success && <p className="login__success">An email has been sent to {data.email} to login</p>}
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
        {error && <p className="input__error">{`${error} !`}</p>}
        <button type="submit" className={styles.loginBtn}>
          Sign in
        </button>
        <div className={`${styles.login__link} txt-medium`} onClick={() => updateLoginOption('userAndPass')}>
            Sign in with password instead
        </div>
        <p className={styles.login__text}>Don&apos;t have an account? <Link href="/login?id=signup" className={styles.login__link}>Sign up</Link> </p>
        <GoogleSignInButton onClick={handleSignInWithGoogle} className="googleBtn"/>
      </form>
    </div>
    </>
  )
}