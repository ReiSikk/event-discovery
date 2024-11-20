import { useRouter } from 'next/router'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/component'
import SignupForm from '@/components/LoginForm'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()


  async function logIn() {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error(error)
    }
    router.push('/')
  }

  return (
    <section className='loginForm__section container'>
      <SignupForm logIn={logIn} />
    </section>
  )
}