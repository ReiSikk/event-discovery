import React, {useState} from 'react'
import { Plus } from 'lucide-react'
import styles from './FilterCard.module.css'

function FilterCard({ filter, children }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };


  return (
    <div className={styles.filterCard} onClick={toggleAccordion}>
      <span className={styles.title}>{filter}</span>
      <div 
        className={styles.filterCard__button}
        aria-expanded={isExpanded}
      >
        <Plus className={`${styles.icon} ${isExpanded ? styles.iconRotated : ''}`} />
      </div>
      <div 
        className={`${styles.filterCard__inner} ${isExpanded ? styles.expanded : ''}`}
      >
        {children}
      </div>
    </div>
  )
}


export default FilterCard