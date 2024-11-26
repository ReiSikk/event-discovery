import React from 'react'
import styles from './CategoriesList.module.css'
import Image from 'next/image'
import placeholder from '../../public/assets/category_placehold.jpg'
import { useState } from 'react'
import Link from 'next/link'

function CategoriesList() {
    const [activeCategory, setActiveCategory] = useState(null);

    //TODO Sample categories array - replace with your data source
    const categories = [
        { id: 1, name: 'Category 1', image: placeholder },
        { id: 2, name: 'Category 2', image: placeholder },
        { id: 3, name: 'Category 3', image: placeholder },
        { id: 4, name: 'Category 4', image: placeholder },
    ];

    const toggleCategory = (categoryId) => {
        setActiveCategory(activeCategory === categoryId ? null : categoryId);
    };

  return (
    <section className={styles.categories}>
        <div className={styles.categories__wrap}>
            <Link href="/events" className={styles.categories__btn}>
                Show me all events
            </Link>
            <ul className={styles.categoriesList}>
            {categories.map((category) => (
                        <li
                            key={category.id}
                            className={`${styles.categoriesList__item} ${activeCategory === category.id ? styles.active : ''}`}
                            onClick={() => toggleCategory(category.id)}
                        >
                            <Image 
                                src={category.image}
                                alt={category.name}
                                className={styles.categoriesList__img}
                            />
                            <p className={styles.categoriesList__text}>
                                {category.name}
                            </p>
                        </li>
                    ))}
            </ul>
        </div>
    </section>
  )
}

export default CategoriesList