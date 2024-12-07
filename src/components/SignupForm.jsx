import { useRouter } from 'next/router'
import { useState, useActionState } from 'react'
import { createClient } from '@/utils/supabase/component'
import styles from './LoginForm.module.css'
import Link from 'next/link'
import { ArrowBottomRightIcon } from '@radix-ui/react-icons'
import { createUser } from '@/actions/actions'
import * as Form from '@radix-ui/react-form'

export default function SignUpForm() {
  const router = useRouter()
  const supabase = createClient()

  //WITH SERVER ACTIONS
  // const [ response, action, isPending ] = useActionState(createUser, null);

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)

    //User creation logic
    const createUser = async (e) => {
      e.preventDefault();

      console.log(email, password, "sign up called with");
  
      try {
          const userData = {
              email: email?.trim(), // Trim any whitespace
              password: password?.trim(), // Trim any whitespace
          };
  
          // Log the user data before sign up
          
          // Check if email and password are valid
          if (!userData.email || !userData.password) {
            return {
              success: false,
              message: 'Email and password are required',
            }
          }
          
          console.log('User data for sign up:', userData);
          // Step 1: Sign up the user
          const { user, error: signUpError } = await supabase.auth.signUp(userData);
  
          // Log the full error object for debugging
          if (signUpError) {
              console.error('Sign up error:', signUpError);
              throw new Error('Failed to create user. Please try again.');
          }
  
          // Check if user is created successfully
          if (!user) {
              throw new Error('User creation failed. No user object returned.');
          }
  
          // Step 2: Insert the profile
          const profileData = {
              id: user.id, // Use the user's ID from the sign-up response
              email: userData.email, // Ensure this is set correctly
              // Add other profile fields as necessary
          };
  
          // Log the profile data before inserting
          console.log('Profile data for insertion:', profileData);
  
          const { data, error: insertError } = await supabase
              .from('profiles')
              .insert([profileData])
              .select()
              .single();
  
          if (insertError) {
              console.error('Insert error:', insertError.message);
              throw new Error('Failed to create profile. Please try again.');
          }
  
          return {
              success: true,
              message: 'User created successfully',
              data: data,
          };
  
      } catch (error) {
          console.error('Form submission error:', error);
          return { 
              success: false, 
              message: error.message 
          };
      }
  }

  
  /* function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
} */


 /*  const handleSubmit = async (e) => {
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
  }; */


  return (
    <div className={styles.loginForm__wrap}>
      <h1 className={styles.loginForm__title}>Register an account</h1>
      <Form.Root onSubmit={createUser} className={styles.loginForm}>
      <Form.Field name="email" className={styles.loginForm__row} >
				<Form.Label className={styles.loginForm__label}>Email</Form.Label>
				<Form.Control
          className={styles.loginForm__input}
          id="email"
          type="email" 
          value={email} 
          placeholder='Your email'
          autoComplete="email"
          // onBlur={(e) => isValidEmail(e.target.value)} 
          onChange={(e) => setEmail(e.target.value)}
         />
				<Form.Message match="valueMissing" className={styles.formField__message}>
					Please enter an email
				</Form.Message>
			</Form.Field>
        <Form.Field name="password" className={styles.loginForm__row}>
          <Form.Label className={styles.loginForm__label} htmlFor="password">Password:</Form.Label>
          <Form.Control
            className={styles.loginForm__input}
            id="password"
            type="password"
            placeholder='Enter a password'
            autoComplete='current-password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Field>
        {/* <Form.Field className={styles.loginForm__row}>
          <Form.Label className={styles.loginForm__label} htmlFor="password">Confirm Password:</Form.Label>
          <input
            className={styles.loginForm__input}
            id="confirm-password"
            type="password"
            placeholder='Confirm Password'
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Field> */}
        {error && <p className={styles.login__error}>{`${error}!`}</p>}
        <Form.Submit className={styles.loginBtn}>
          Submit
        </Form.Submit>
        <p className={styles.login__text}>Already have an account? <Link href="/login" className={styles.login__link}>Log In</Link> </p>
      </Form.Root>
    </div>
  )
}