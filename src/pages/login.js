import { useRouter } from 'next/router'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/component'
import LoginForm from '@/components/LoginForm'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function logIn() {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error(error)
    }
    router.push('/')
  }

  async function signUp() {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      console.error(error)
    }
    router.push('/')
  }

  return (
    <main>
      <LoginForm signUp={signUp} />
    </main>
  )
}