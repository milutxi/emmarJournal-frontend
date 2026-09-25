import { Link } from "react-router-dom";
import styles from "./index.module.scss"; // Assuming you want to style it

const Index = () => {
  return (
    <div className={styles.index}>
      <header className={styles.header}>
        <img
          className={styles["header__logo"]}
          src="https://assets-global.website-files.com/6394edc1cd797257200998bc/63963420883c851c66e77a08_emmar%20beauty%20logo.svg"
          alt="emmar logo"
        />
      </header>
      <main className={styles.indexContainer}>
        <div className={styles.buttonContainer}>
          <Link to="/app/journal" className={styles.link}>
            <span className={styles.button}>Journal</span>
          </Link>
          <Link to="/app/clients" className={styles.link}>
            <span className={styles.button}>Kunder</span>
          </Link>

          <Link to="/app/treatments" className={styles.link}>
            <span className={styles.button}>Behandlingar</span>
          </Link>
          <Link to="/app/machines" className={styles.link}>
            <span className={styles.button}>Maskiner</span>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Index;
