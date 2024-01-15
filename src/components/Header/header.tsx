import { Link } from 'react-router-dom';
import styles from './header.module.scss'

const Header = () => {
    return(
        <div className={styles.header}>
            <div>
                <img className={styles["header__logo"]} src="https://assets-global.website-files.com/6394edc1cd797257200998bc/63963420883c851c66e77a08_emmar%20beauty%20logo.svg" alt="emmar logo"></img>
            </div>
            <div className={styles["header__navigation"]}>
                <Link to="/journal" className={styles["header__enlace"]}>
                    <button className={styles["header__button"]}>JOURNAL</button>
                </Link>
                <Link to="/client" className={styles["header__enlace"]}>
                    <button className={styles["header__button"]}>KUNDER</button>
                </Link>
                <Link to="/treatments" className={styles["header__enlace"]}>
                    <button className={styles["header__button"]}>BEHANDLINGAR</button>
                </Link>
                <Link to="machines" className={styles["header__enlace"]}>
                    <button className={styles["header__button"]}>MACHINES</button>
                </Link>             
            </div>
        </div>
    )
}

export default Header;