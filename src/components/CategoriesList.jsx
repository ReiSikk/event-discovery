import React from 'react'
import styles from './CategoriesList.module.css'
import Image from 'next/image'
import placeholder from '../../public/assets/category_placehold.jpg'

function CategoriesList() {
  return (
    <section className={styles.categories}>
        <div className={styles.categories__wrap}>
            <div className={styles.categoriesHeader}>
                <div className={styles.categories__btn}></div>
                <ul className={styles.categoriesList}>
                    <li className={styles.categoriesList__item}>
                        {/* //TODO: REMOVE TEMP */}
                        <Image src={placeholder} objectFit='' alt="" className={styles.categoriesList__img}>
                        </Image>
                        <p className={styles.categoriesList__text}>
                            Category name here
                        </p>
                    </li>
                    <li className={styles.categoriesList__item}>
                        {/* //TODO: REMOVE TEMP */}
                        <Image src={placeholder} objectFit='' alt="" className={styles.categoriesList__img}>
                        </Image>
                        <p className={styles.categoriesList__text}>
                            Category name here
                        </p>
                    </li>
                    <li className={styles.categoriesList__item}>
                        {/* //TODO: REMOVE TEMP */}
                        <Image src={placeholder} objectFit='' alt="" className={styles.categoriesList__img}>
                        </Image>
                        <p className={styles.categoriesList__text}>
                            Category name here
                        </p>
                    </li>
                    <li className={styles.categoriesList__item}>
                        {/* //TODO: REMOVE TEMP */}
                        <Image src={placeholder} objectFit='' alt="" className={styles.categoriesList__img}>
                        </Image>
                        <p className={styles.categoriesList__text}>
                            Category name here
                        </p>
                    </li>
                    <li className={styles.categoriesList__item}>
                        {/* //TODO: REMOVE TEMP */}
                        <Image src={placeholder} objectFit='' alt="" className={styles.categoriesList__img}>
                        </Image>
                        <p className={styles.categoriesList__text}>
                            Category name
                        </p>
                    </li>
                    <li className={styles.categoriesList__item}>
                        {/* //TODO: REMOVE TEMP */}
                        <Image src={placeholder} objectFit='' alt="" className={styles.categoriesList__img}>
                        </Image>
                        <p className={styles.categoriesList__text}>
                            Category
                        </p>
                    </li>
                    <li className={styles.categoriesList__item}>
                        {/* //TODO: REMOVE TEMP */}
                        <Image src={placeholder} objectFit='' alt="" className={styles.categoriesList__img}>
                        </Image>
                        <p className={styles.categoriesList__text}>
                            Category name here
                        </p>
                    </li>
                    <li className={styles.categoriesList__item}>
                        {/* //TODO: REMOVE TEMP */}
                        <Image src={placeholder} objectFit='' alt="" className={styles.categoriesList__img}>
                        </Image>
                        <p className={styles.categoriesList__text}>
                            Category name
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    </section>
  )
}

export default CategoriesList