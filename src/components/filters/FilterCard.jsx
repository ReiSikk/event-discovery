import { useState } from 'react';
import styles from './FilterCard.module.css';
import { CheckIcon, ChevronDownIcon, PlusIcon } from 'lucide-react';

function FilterCard({ filter, filterState, onCategorySelect, categories }) {
  const [isExpanded, setIsExpanded] = useState(false);

   // Check if any categories are selected for this filter
   const isFilterActive = categories && filterState.categories.length > 0;

  return (
    <div className={styles.filterCard}>
      <div 
        className={styles.filterCard__button}
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        aria-expanded={isExpanded}
      >
        <span>{filter.text}</span>
        <ChevronDownIcon size={24} />
      </div>
      <div 
        className={`${styles.filterCard__inner} ${
          isExpanded ? styles.expanded : ''
        }`}
      >
        {categories && categories.map(category => (
          <div
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`${styles.filterSelect__item} ${
              filterState.categories.includes(category.id) ? styles.active : ''
            }`}
          >
            {category.name}
            <CheckIcon size={16} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FilterCard;