import { Link, NavLink } from "react-router-dom";
import styles from "./header.module.scss";

const Header = () => {
  return (
    <div className={styles.header}>
      <div>
        <Link to="/">
          <img
            className={styles["header__logo"]}
            src="https://assets-global.website-files.com/6394edc1cd797257200998bc/63963420883c851c66e77a08_emmar%20beauty%20logo.svg"
            alt="emmar logo"
          ></img>
        </Link>
      </div>
      <div className={styles["header__navigation"]}>
        <NavLink
          to="/app/journal"
          className={({ isActive }) =>
            isActive
              ? `${styles["header__button"]} ${styles["header__buttonActive"]}`
              : styles["header__button"]
          }
        >
          JOURNAL
        </NavLink>
        <NavLink
          to="/app/clients"
          className={({ isActive }) =>
            isActive
              ? `${styles["header__button"]} ${styles["header__buttonActive"]}`
              : styles["header__button"]
          }
        >
          KUNDER
        </NavLink>
        <NavLink
          to="/app/treatments"
          className={({ isActive }) =>
            isActive
              ? `${styles["header__button"]} ${styles["header__buttonActive"]}`
              : styles["header__button"]
          }
        >
          BEHANDLINGAR
        </NavLink>
        <NavLink
          to="/app/machines"
          className={({ isActive }) =>
            isActive
              ? `${styles["header__button"]} ${styles["header__buttonActive"]}`
              : styles["header__button"]
          }
        >
          MASKINER
        </NavLink>
      </div>
    </div>
  );
};

export default Header;
