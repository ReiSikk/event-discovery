import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/component'
import LoginForm from '@/components/forms/LoginForm'
import * as Tabs from "@radix-ui/react-tabs";
import SignUpForm from '@/components/forms/SignupForm';

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState("tab1")

  //TODO: Check for user session
  // if user is logged in redirect to home page
  
  


  async function logIn() {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error(error)
    }
    router.push('/')
  }

  return (
    <section className='loginForm__section container'>
       <Tabs.Root className="tabs__root" defaultValue="tab1" value={activeTab}
      onValueChange={setActiveTab}>
       <Tabs.List className={`tabs__list ${activeTab === "tab1" ? 'slide-left' : 'slide-right'}`} aria-label="Manage your account">
          <Tabs.Trigger className="tabs__trigger" value="tab1">
            Log In
          </Tabs.Trigger>
          <Tabs.Trigger className="tabs__trigger" value="tab2">
            Sign Up
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className="tabs__content" value="tab1">
          <LoginForm login={logIn}/>
        </Tabs.Content>
        <Tabs.Content className="tabs__content" value="tab2">
          <SignUpForm />
        </Tabs.Content>
      </Tabs.Root>
    </section>
  )
}