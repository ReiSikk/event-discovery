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
      router.push('/dashboard') // Redirect to dashboard after successful login
    } catch (err) {
      setError(err.message)
    }
  }

/*   async function handleSignInWithGoogle(response) {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: response.credential,
    })
  } */
    const handleSignInWithGoogle = async () => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: 'http://localhost:3000/auth/callback',
        },
      })

      console.log(data, "Data from handleSignInWithGoogle");
      
      if (data.url) {
        redirect(data.url) // use the redirect API for your server framework
      }
    };

  return (
    <>
    <Script src="https://accounts.google.com/gsi/client" />
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
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="button" className={styles.loginBtn}>
          Log in
        </button>
        <p className={styles.login__text}>Don't have an account? <Link href="/signup" className={styles.login__link}>Sign Up</Link> </p>
        {error && <p>{error}</p>}
        <GoogleSignInButton onClick={handleSignInWithGoogle} />
      </form>
    </div>
    </>
  )
}