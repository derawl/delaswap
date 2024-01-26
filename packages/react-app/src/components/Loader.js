import React from 'react'
import styles from '../styles'
import { ethereumLogo } from '../assets'

const Loader = ({ title, image }) => {
    return (
        <div className={styles.loader}>
            <img src={image}
                className={styles.loaderImg}
            />
            <p className={styles.loaderText}>{title}</p>
        </div>
    )
}

export default Loader