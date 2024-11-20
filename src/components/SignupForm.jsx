import { useRouter } from 'next/router'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/component'
import styles from './SignupForm.module.css'
import Link from 'next/link'

export default function SignUp() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  async function logIn() {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error(error)
    }
    router.push('/')
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    await signUp();
  };

  async function signUp() {

    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      console.error(error)
      setError(error.message)
    } else {
      console.log(data)
      router.push('/')
    }
  }

  return (
    <div className={styles.signupForm__wrap}>
      <h1 className={styles.signupForm__title}>Log In or Register</h1>
      <form onSubmit={handleSubmit} className={styles.signupForm}>
        <div className={styles.signupForm__row}>
          <label className={styles.signupForm__label} htmlFor="email">Email:</label>
          <input
            className={styles.signupForm__input}
          id="email"
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <div className={styles.signupForm__row}>
          <label className={styles.signupForm__label} htmlFor="password">Password:</label>
          <input
            className={styles.signupForm__input}
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="button" className={styles.loginBtn}>
          Log in
        </button>
        <p className={styles.signUp__text}>Don't have an account? <Link href="/signup" className={styles.signUp__link}>Sign Up</Link> </p>
        {error && <p>{error}</p>}
      </form>
    </div>
  )
}