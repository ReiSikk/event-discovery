import React from 'react'
import styles from './SiteNav.module.css'
import Link from 'next/link'
import { ArrowTopRightIcon } from "@radix-ui/react-icons"
import SiteNavMenu from './SiteNavMenu'


function SiteNav() {
  return (
    <header className={`${styles.header} ${styles.container}`}>
    <nav className={styles.siteNav}>
        <Link href="/">
            <h1 className={styles.siteNav__logo}>Leia</h1>
        </Link>
        <SiteNavMenu />
    </nav>
  </header>
  )
}

export default SiteNav