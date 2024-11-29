import React, {useState} from 'react'
import { Plus } from 'lucide-react'
import styles from './FilterCard.module.css'

function FilterCard({ filter, children, categories }) {
  console.log(categories, "categories in filtercard")
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
        {categories && 
          <div className={styles.filterSelect}>
            {categories.map((category) => (
              <div key={category.id} className={styles.filterSelect__item}>
                {category.name}
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  )
}


export default FilterCard