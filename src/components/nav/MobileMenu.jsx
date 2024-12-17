import React from 'react'
import { useBurgerMenu } from '@/components/nav/BurgerMenuProvider'
import styles from './MobileMenu.module.css'
import classNames from 'classnames'
import { X, XCircleIcon } from 'lucide-react'
import Link from 'next/link'
import { LogIn, LogOut } from 'lucide-react'
import { createClient } from '@/utils/supabase/component'
import { useAuth } from '@/pages/api/auth/authprovider'
import { useRouter } from 'next/router'

function MobileMenu() {
    const supabase = createClient()
    const { session } = useAuth()
    const { isMenuOpen, toggleMenu } = useBurgerMenu()
    const router = useRouter()


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
    <div className={classNames(styles.mobileMenu, { [styles.mobileMenu__open]: isMenuOpen })}>
        <div className={styles.mobileMenu__header}>
            <Link 
            href="/" 
            className={`${styles.mobileMenu__title} h1`}
            onClick={toggleMenu}
            >LEIA</Link>
            <div className={styles.mobileMenu__close} onClick={toggleMenu}>
                <XCircleIcon size={32} />
            </div>
        </div>
        <div className={`${styles.mobileMenu__inner} container`}>
            <ul className={classNames(styles.mobileMenu__list, { [styles.mobileMenu__list_open]: isMenuOpen })}>
                <li className={styles.mobileMenu__item}>
                    <Link 
                    href="/home" 
                    className={`${styles.mobileMenu__link} h3`}
                    onClick={toggleMenu}
                    >
                        Events
                    </Link>
                </li>
                <li className={styles.mobileMenu__item}>
                    <Link 
                    href="/organiser" 
                    className={`${styles.mobileMenu__link} h3`}
                    onClick={toggleMenu}
                    >
                        For Organisers
                    </Link>
                </li>
                <li className={styles.mobileMenu__item}>
                    <Link 
                    href="/event/create" 
                    className={`${styles.mobileMenu__link} h3`}
                    onClick={toggleMenu}
                    >
                        Create Event
                    </Link>
                </li>
                <li className={styles.mobileMenu__item}>
                    <Link 
                    href={session ? '/profile' : '/login'}
                    className={`${styles.mobileMenu__link} h3`}
                    onClick={toggleMenu}
                    >
                        {session ? 'My profile' : 'Sign In'}
                    </Link>
                </li>
            </ul>
            <div className={styles.mobileMenu__footer}>
                <div className={styles.footer__contacts}>
                    <h2>LEIA</h2>
                    <p>Valukoja 18A</p>
                    <p>Tallinn, Estonia</p>
                    <a href="tel:+372 555555555" className='txt-small'>+372 55008922</a>
                </div>
                <div className={styles.mobileMenu__buttons}>
                {session ?
                    <Link 
                    href="/" 
                    className="btn btn__primary"
                    onClick={handleLogOut}
                    >
                    Log out <LogOut size={16}/>
                    </Link>
                    : 
                    <Link 
                    href="/login" 
                    className="btn btn__primary btn__secondary"
                    onClick={toggleMenu}
                    >
                            Sign Up <LogIn size={16}/>
                    </Link>
                }
                </div>
            </div>
        </div>
    </div>
  )
}

export default MobileMenu