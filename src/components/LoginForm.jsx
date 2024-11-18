import React from 'react'
import * as Form from "@radix-ui/react-form";
import styles from './LoginForm.module.css';

function LoginForm({signUp}) {
  return (
    <Form.Root className={styles.loginForm} onSubmit={signUp}>
    <h1 className={styles.loginForm__title}>Log in</h1>
  <Form.Field className={styles.loginForm__row} name="email">
    <Form.Label className={styles.loginForm__label}>
      Email
    </Form.Label>
    <Form.Control asChild>
      <input
        className={styles.loginForm__input}
        type="email"
        required
        placeholder="Enter your email"
      />
    </Form.Control>
    <Form.Message className={styles.loginForm__validate} match="valueMissing">
      Please enter your email
    </Form.Message>
  </Form.Field>

  <Form.Field className={styles.loginForm__row} name="password">
    <Form.Label className={styles.loginForm__label}>
      Password
    </Form.Label>
    <Form.Control asChild>
      <input
        className={styles.loginForm__input}
        type="password"
        required
        placeholder="Enter your password"
      />
    </Form.Control>
    <Form.Message className={styles.loginForm__validate} match="valueMissing">
      Please enter your password
    </Form.Message>
  </Form.Field>

  <Form.Submit asChild>
    <button className={styles.loginBtn}>
     Sign Up
    </button>
  </Form.Submit>
</Form.Root>
  )
}

export default LoginForm