import { useRouter } from 'next/router'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/component'
import styles from './LoginForm.module.css'
import Link from 'next/link'

export default function Login() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    await login();
  };

  async function login() {

    const { data, error } = await supabase.auth.login({ email, password })
    if (error) {
      console.error(error)
      setError(error.message)
    } else {
      console.log(data)
      router.push('/')
    }
  }

  return (
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
      </form>
    </div>
  )
}