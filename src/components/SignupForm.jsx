import { useRouter } from 'next/router'
import { useState } from 'react'

import { createClient } from '@/utils/supabase/component'

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
    <main>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button">
          Log in
        </button>
        <button type="submit">
          Sign up
        </button>
        {error && <p>{error}</p>}
      </form>
    </main>
  )
}