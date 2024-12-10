import { useRouter } from 'next/router'
import { useState, useActionState } from 'react'
import { createClient } from '@/utils/supabase/component'
import styles from './LoginForm.module.css'
import Link from 'next/link'
import * as Form from '@radix-ui/react-form'

export default function SignUpForm() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [userCreated, setUserCreated] = useState(false)


    //User creation logic
    const signUpNewUser = async (e) => {
      e.preventDefault();  
      console.log('signing up');
      try {
          const userData = {
              email: email?.trim(),
              password: password?.trim(),
          };

          // Check if passwords match
          if (password !== confirmPassword) {
            console.log('passwords dont match');
            serError('Passwords do not match');
            return;
          }
          
          const { data, error } = await supabase.auth.signUp({email: email, password: password});

          if (data?.session?.access_token) (
            setUserCreated(true),
            setTimeout(() => {
              router.push('/home')
              setUserCreated(false)
            }, 2000)
          )
  
      } catch (error) {
          console.error('Form submission error:', error);
          setError(error.message);
      }
  }


  return (
    <div className={styles.loginForm__wrap}>
      <h1 className={styles.loginForm__title}>Register an account</h1>
      {userCreated &&
      <div className="signup__success">
        <p>
          You have successfully signed up!
        </p>
        <span>Redirecting to home page...</span>
      </div>
      }
      <Form.Root onSubmit={signUpNewUser} className={styles.loginForm}>
      <Form.Field name="name" className="form__row" >
				<Form.Label className="form__label">First and last name</Form.Label>
				<Form.Control
          className="form__input"
          id="name"
          type="text" 
          value={name} 
          maxLength={256}
          placeholder='Your name'
          autoComplete="name"
          pattern="^[A-Za-zÀ-ÖØ-öø-ÿ\-']{2,}(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ\-']{2,})+$"
          required
          onChange={(e) => setName(e.target.value)}
         />
          <Form.Message 
            match="patternMismatch"
            className="input__message"
          >
            Please enter a valid name
				</Form.Message>
        {error && <p className="input__error">{`${error.message}!`}</p>}
			</Form.Field>
      <Form.Field name="email" className="form__row" >
				<Form.Label className="form__label">Email</Form.Label>
				<Form.Control
          className="form__input"
          id="email"
          type="email" 
          value={email} 
          maxLength={256}
          placeholder='Your email'
          autoComplete="email"
          required
          onChange={(e) => setEmail(e.target.value)}
         />
          <Form.Message 
            match="typeMismatch"
            className="input__message"
          >
            Please enter a valid email address
				</Form.Message>
        {error && <p className="input__error">{`${error.message}!`}</p>}
			</Form.Field>
        <Form.Field name="password" className="form__row">
          <Form.Label className="form__label" htmlFor="password">Password:</Form.Label>
          <Form.Control
            className="form__input"
            id="password"
            type="password"
            placeholder='Enter a password'
            autoComplete='current-password'
            pattern='(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}'
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Form.Message
            match="patternMismatch"
            className="input__message"
          >
            Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters
          </Form.Message>
        </Form.Field>
        <Form.Field className="form__row">
          <Form.Label className="form__label" htmlFor="confirm-password">Confirm Password:</Form.Label>
          <input
            className="form__input"
            id="confirm-password"
            type="password"
            placeholder='Confirm your password'
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Form.Message
              match="valueMissing"
              className="input__message"
            >
              Please repeat your password
            </Form.Message>
        </Form.Field>
        {error && <p className="input__error">{`${error}!`}</p>}
        <Form.Submit className={styles.loginBtn}>
          Sign Up
        </Form.Submit>
        <p className={styles.login__text}>Already have an account? <Link href="/login" className={styles.login__link}>Log In</Link> </p>
      </Form.Root>
    </div>
  )
}