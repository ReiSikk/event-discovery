import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/component'
import styles from './LoginForm.module.css'
import Link from 'next/link'
import Script from 'next/script'
import GoogleSignInButton from './GoogleSignInButton'

export default function LoginForm() {
  const router = useRouter()
  const supabase = createClient()

  const [data, setData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false )

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data: dataUser, error: signInError } = await supabase
      .auth
      .signInWithOtp({
         email: data.email,
         options: {
          shouldCreateUser: true
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
    }, [router])



  return (
    <>
    <Script src="https://accounts.google.com/gsi/client" async/>
    <div className={styles.loginForm__wrap}>
      <h1 className={styles.loginForm__title}>Log in to your account</h1>
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
        {/* <div className="form__row">
          <label className="form__label" htmlFor="password">Password:</label>
          <input
            className="form__input"
            id="password"
            type="password"
            value={password}
            autoComplete='current-password'
            placeholder='Your password'
            onChange={(e) => setPassword(e.target.value)}
          />
        </div> */}
        {error && <p className="input__error">{`${error}!`}</p>}
        <button type="submit" className={styles.loginBtn}>
          Log in
        </button>
        <p className={styles.login__text}>Don't have an account? <Link href="/signup" className={styles.login__link}>Sign Up</Link> </p>
        <GoogleSignInButton onClick={handleSignInWithGoogle} />
      </form>
      {success && <p className={styles.login__success}>An email has been sent to {data.email} to login</p>}
    </div>
    </>
  )
}