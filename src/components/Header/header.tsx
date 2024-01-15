import styles from './header.module.scss'

const Header = () => {
    return(
        <div className={styles.header}>
            <div>
                <img className={styles["header__logo"]} src="https://assets-global.website-files.com/6394edc1cd797257200998bc/63963420883c851c66e77a08_emmar%20beauty%20logo.svg" alt="emmar logo"></img>
            </div>
            <div>
                navigation bar
            </div>
        </div>
    )
}

export default Header;