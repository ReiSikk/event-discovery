import React from 'react'
import styles from './SiteNav.module.css'
import Link from 'next/link'
import { ArrowTopRightIcon } from "@radix-ui/react-icons"
import SiteNavMenu from '../SiteNavMenu'
import { useAuth } from '@/pages/api/auth/authprovider'
import { LogIn, LogOut, MenuIcon } from 'lucide-react'
import { createClient } from '@/utils/supabase/component'
import { useRouter } from 'next/router'
import { useBurgerMenu } from '@/components/nav/BurgerMenuProvider'
import MobileMenu from './MobileMenu'


function SiteNav() {
  const supabase = createClient()
  const { session } = useAuth()
  const router = useRouter()

  const { isMenuOpen, toggleMenu } = useBurgerMenu()

  const handleLogOut = async () => {
    console.log('Logging out')
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Sign out error:', error.message)
    } else {
      console.log('Logged out successfully')
      router.push('/')
    }
  }

  return (
    <header className={`${styles.header} ${styles.container}`}>
    <nav className={styles.siteNav}>
        <Link href="/">
            <h1 className={styles.siteNav__logo}>Leia</h1>
        </Link>
        <SiteNavMenu />
        {session ?
        <Link 
        href="/" 
        className={`${styles.siteNav__btn} btn btn__primary`}
        onClick={handleLogOut}
        >
          Log out <LogOut size={16}/>
        </Link>
        : 
        <Link href="/login" className={`${styles.siteNav__btn} btn btn__primary`}>
                Sign In <LogIn size={16}/>
        </Link>
        }
        <MenuIcon size={32} className={styles.siteNav__toggle} onClick={toggleMenu}/>
        <MobileMenu />
    </nav>
  </header>
  )
}

export default SiteNav