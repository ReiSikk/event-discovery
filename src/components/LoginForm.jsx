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

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data, error: signInError } = await supabase.auth.signIn({ email, password })
      if (signInError) throw signInError
      router.push('/home') // Redirect to dashboard after successful login
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
        <div className={styles.loginForm__row}>
          <label className={styles.loginForm__label} htmlFor="email">Email:</label>
          <input
            className={styles.loginForm__input}
          id="email"
          type="email" 
          value={email} 
          placeholder='Your email'
          autoComplete='email'
          onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <div className={styles.loginForm__row}>
          <label className={styles.loginForm__label} htmlFor="password">Password:</label>
          <input
            className={styles.loginForm__input}
            id="password"
            type="password"
            value={password}
            autoComplete='current-password'
            placeholder='Your password'
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className={styles.login__error}>{`${error}!`}</p>}
        <button type="button" className={styles.loginBtn}>
          Log in
        </button>
        <p className={styles.login__text}>Don't have an account? <Link href="/signup" className={styles.login__link}>Sign Up</Link> </p>
        <GoogleSignInButton onClick={handleSignInWithGoogle} />
      </form>
    </div>
    </>
  )
}