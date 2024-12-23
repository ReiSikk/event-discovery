import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/component'
import LoginForm from '@/components/forms/LoginForm'
import * as Tabs from "@radix-ui/react-tabs";
import SignUpForm from '@/components/forms/SignupForm';
import { useAuth } from '@/pages/api/auth/authprovider'
import LoginWithUsername from '@/components/forms/LoginWithUsername';

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const { isLoggedIn } = useAuth()
  const { id } = router.query
  const [activeTab, setActiveTab] = useState(id === 'signup' ? 'tab2' : 'tab1')

  const [loginOption, setLoginOption] = useState('userAndPass')

  const updateLoginOption = (option) => {
    setLoginOption(option)
  }


  //TODO: Check for user session
  // if user is logged in redirect to home page
  useEffect(() => {
    if (isLoggedIn) {
      router.push('/home')
    }
  }, [router, isLoggedIn])

  return (
    <section className='loginForm__section container'>
       <Tabs.Root className="tabs__root" defaultValue="tab1" value={activeTab}
      onValueChange={setActiveTab}>
       <Tabs.List className={`tabs__list ${activeTab === "tab1" ? 'slide-left' : 'slide-right'}`} aria-label="Manage your account">
          <Tabs.Trigger className="tabs__trigger" value="tab1">
            Sign In
          </Tabs.Trigger>
          <Tabs.Trigger className="tabs__trigger" value="tab2">
            Sign Up
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className="tabs__content" value="tab1">
        {loginOption === 'email' && <LoginForm updateLoginOption={updateLoginOption}/>}
        {loginOption === 'userAndPass' && <LoginWithUsername updateLoginOption={updateLoginOption}/>}
        {/* <LoginForm login={logIn}/> */}
        </Tabs.Content>
        <Tabs.Content className="tabs__content" value="tab2">
          <SignUpForm />
        </Tabs.Content>
      </Tabs.Root>
    </section>
  )
}