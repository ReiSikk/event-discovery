import React from 'react'
import { Plus } from 'lucide-react'
import styles from './FilterCard.module.css'

function FilterCard({ filter, isActive, onClick, id }) {
  return (
    <div
        className={`${styles.filterCard} ${isActive ? styles.expanded : ''}`}
        onClick={() => onClick(id)}
    >
        <h4 className={styles.title}>{filter}</h4>
        <Plus className={styles.button}/>
    </div>
  )
}


export default FilterCard