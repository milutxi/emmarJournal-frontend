// import { Link, NavLink } from "react-router-dom";
// import styles from "./header.module.scss";
// import UserMenu from "../UserMenu/userMenu";

// const Header = () => {
//   return (
//     <div className={styles.header}>
//       <div>
//         <Link to="/">
//           <img
//             className={styles["header__logo"]}
//             src="https://assets-global.website-files.com/6394edc1cd797257200998bc/63963420883c851c66e77a08_emmar%20beauty%20logo.svg"
//             alt="emmar logo"
//           ></img>
//         </Link>
//       </div>
//       <div className={styles["header__navigation"]}>
//         <NavLink
//           to="/app/journal"
//           className={({ isActive }) =>
//             isActive
//               ? `${styles["header__button"]} ${styles["header__buttonActive"]}`
//               : styles["header__button"]
//           }
//         >
//           JOURNAL
//         </NavLink>
//         <NavLink
//           to="/app/clients"
//           className={({ isActive }) =>
//             isActive
//               ? `${styles["header__button"]} ${styles["header__buttonActive"]}`
//               : styles["header__button"]
//           }
//         >
//           KUNDER
//         </NavLink>
//         <NavLink
//           to="/app/treatments"
//           className={({ isActive }) =>
//             isActive
//               ? `${styles["header__button"]} ${styles["header__buttonActive"]}`
//               : styles["header__button"]
//           }
//         >
//           BEHANDLINGAR
//         </NavLink>
//         <NavLink
//           to="/app/machines"
//           className={({ isActive }) =>
//             isActive
//               ? `${styles["header__button"]} ${styles["header__buttonActive"]}`
//               : styles["header__button"]
//           }
//         >
//           MASKINER
//         </NavLink>
//       </div>
//       <div>
//         <UserMenu />
//       </div>
//     </div>
//   );
// };

// export default Header;

import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import styles from "./header.module.scss";
import UserMenu from "../UserMenu/userMenu";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <header className={styles.header}>
        <Link to="/" onClick={closeMenu}>
          <img
            className={styles.header__logo}
            src="https://assets-global.website-files.com/6394edc1cd797257200998bc/63963420883c851c66e77a08_emmar%20beauty%20logo.svg"
            alt="Emmar Beauty"
          />
        </Link>

        <nav className={styles.header__navigation}>
          <NavLink
            to="/app/journal"
            className={({ isActive }) =>
              isActive
                ? `${styles.header__button} ${styles.header__buttonActive}`
                : styles.header__button
            }
          >
            JOURNAL
          </NavLink>

          <NavLink
            to="/app/clients"
            className={({ isActive }) =>
              isActive
                ? `${styles.header__button} ${styles.header__buttonActive}`
                : styles.header__button
            }
          >
            KUNDER
          </NavLink>

          <NavLink
            to="/app/treatments"
            className={({ isActive }) =>
              isActive
                ? `${styles.header__button} ${styles.header__buttonActive}`
                : styles.header__button
            }
          >
            BEHANDLINGAR
          </NavLink>

          <NavLink
            to="/app/machines"
            className={({ isActive }) =>
              isActive
                ? `${styles.header__button} ${styles.header__buttonActive}`
                : styles.header__button
            }
          >
            MASKINER
          </NavLink>
        </nav>

        <div className={styles.header__desktopUser}>
          <UserMenu />
        </div>

        <button
          type="button"
          className={`${styles.header__menuButton} ${
            menuOpen ? styles.header__menuButtonOpen : ""
          }`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Stäng meny" : "Öppna meny"}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <div
        className={`${styles.mobileOverlay} ${
          menuOpen ? styles.mobileOverlayOpen : ""
        }`}
        onClick={closeMenu}
      />

      <aside
        className={`${styles.mobileMenu} ${
          menuOpen ? styles.mobileMenuOpen : ""
        }`}
      >
        <nav className={styles.mobileMenu__navigation}>
          <NavLink
            to="/app/journal"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive
                ? `${styles.mobileMenu__link} ${styles.mobileMenu__linkActive}`
                : styles.mobileMenu__link
            }
          >
            JOURNAL
          </NavLink>

          <NavLink
            to="/app/clients"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive
                ? `${styles.mobileMenu__link} ${styles.mobileMenu__linkActive}`
                : styles.mobileMenu__link
            }
          >
            KUNDER
          </NavLink>

          <NavLink
            to="/app/treatments"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive
                ? `${styles.mobileMenu__link} ${styles.mobileMenu__linkActive}`
                : styles.mobileMenu__link
            }
          >
            BEHANDLINGAR
          </NavLink>

          <NavLink
            to="/app/machines"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive
                ? `${styles.mobileMenu__link} ${styles.mobileMenu__linkActive}`
                : styles.mobileMenu__link
            }
          >
            MASKINER
          </NavLink>
        </nav>

        <div className={styles.mobileMenu__user}>
          <UserMenu />
        </div>
      </aside>
    </>
  );
};

export default Header;