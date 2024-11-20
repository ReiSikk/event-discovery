import React from 'react'
import styles from './SiteNav.module.css'
import Link from 'next/link'
import { ArrowTopRightIcon } from "@radix-ui/react-icons"

function SiteNav() {
  return (
    <header className={`${styles.header} ${styles.container}`}>
    <nav className={styles.siteNav}>
        <Link href="/">
            <h1 className={styles.siteNav__logo}>Leia</h1>
        </Link>
      <ul className={styles.siteSiteNavList}>
        <li className={styles.siteNavList__item}>
          <Link href="/create" className={`${styles.siteNavList__link} ${styles.siteNav__btn}`}>
            Create Events
            <ArrowTopRightIcon />
          </Link>
        </li>
        <li className={styles.nav__item}>
          <Link href="/login" className={styles.siteNavList__link}>
            Log In
          </Link>
        </li>
        <li className={styles.nav__item}>
          <Link href="/signup" className={styles.siteNavList__link}>
            Sign Up
          </Link>
        </li>
      </ul>
    </nav>
  </header>
  )
}

export default SiteNav