import { useRouter } from 'next/router'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/component'
import styles from './LoginForm.module.css'
import Link from 'next/link'
import { ArrowBottomRightIcon } from '@radix-ui/react-icons'

export default function SignUpForm() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  
  function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    // Validation checks first
    try {
      if (!email || !password) {
        setError('Email and password are required');
        return;
      }
  
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
  
      // Only proceed with API call if validations pass
      console.log(email, password, "sign up called with");
      if (!isValidEmail(email)) {
        setError('Invalid email');
        return;
      }
      
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password 
      });
  
      if (error) {
        throw error;
      }
  
      console.log(data);
      router.push('/home');
  
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.loginForm__wrap}>
      <h1 className={styles.loginForm__title}>Register an account</h1>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.loginForm__row}>
          <label className={styles.loginForm__label} htmlFor="email">Email:</label>
          <input
            className={styles.loginForm__input}
          id="email"
          type="email" 
          value={email} 
          placeholder='Your email'
          autoComplete='current-password'
          onBlur={(e) => isValidEmail(e.target.value)} 
          onChange={(e) => setEmail(e.target.value)}
          />
          
        </div>
        <div className={styles.loginForm__row}>
          <label className={styles.loginForm__label} htmlFor="password">Password:</label>
          <input
            className={styles.loginForm__input}
            id="password"
            type="password"
            placeholder='Enter a password'
            autoComplete='current-password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={styles.loginForm__row}>
          <label className={styles.loginForm__label} htmlFor="password">Confirm Password:</label>
          <input
            className={styles.loginForm__input}
            id="confirm-password"
            type="password"
            placeholder='Confirm Password'
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {error && <p className={styles.login__error}>{`${error}!`}</p>}
        <button type="submit" className={styles.loginBtn}>
            Sign Up 
        </button>
        <p className={styles.login__text}>Already have an account? <Link href="/login" className={styles.login__link}>Log In</Link> </p>
      </form>
    </div>
  )
}