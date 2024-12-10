import React from 'react'
import { useBurgerMenu } from '@/components/nav/BurgerMenuProvider'
import styles from './MobileMenu.module.css'

function MobileMenu() {
  const { isMenuOpen } = useBurgerMenu()

  return (
    <div className={styles.mobileMenu}>
        <ul className={styles.mobileMenu__list}>
            <li className={styles.mobileMenu__item}>
                <a href="#" className={styles.mobileMenu__link}>
                    Home
                </a>
            </li>
            <li className={styles.mobileMenu__item}>
                <a href="#" className={styles.mobileMenu__link}>
                    Events
                </a>
            </li>
            <li className={styles.mobileMenu__item}>
                <a href="#" className={styles.mobileMenu__link}>
                    Contact
                </a>
            </li>
        </ul>
        <div className={styles.mobileMenu__buttons}>
            <button className="btn btn__primary">Sign In</button>
            <button className="btn btn__secondary">Sign Up</button>
        </div>
    </div>
  )
}

export default MobileMenu