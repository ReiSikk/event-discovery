import CategoriesList from '@/components/CategoriesList'
import React from 'react'
import styles from '../styles/Browse.module.css'

function BrowsePage() {
  return (
    <main className={styles.mainContainer}>
        <header className={`${styles.header} ${styles.container}`}>
            <h1>Select your interests to get event suggestions based on what you love</h1>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti cupiditate dicta, doloribus dolor quam tenetur beatae saepe, sequi nesciunt dolorum, quia odio maiores. Quas, odit libero similique reprehenderit amet necessitatibus.</p>
            <CategoriesList />
        </header>
    </main>
  )
}

export default BrowsePage