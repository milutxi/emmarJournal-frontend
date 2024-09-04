import React from 'react';
import { Link } from 'react-router-dom';
import styles from './index.module.scss'; // Assuming you want to style it

const Index = () => {
  return (
    <div className={styles.index}>
        <div className={styles.header}>

            <img className={styles["header__logo"]} src="https://assets-global.website-files.com/6394edc1cd797257200998bc/63963420883c851c66e77a08_emmar%20beauty%20logo.svg" alt="emmar logo"></img>
        </div>
    <div className={styles.indexContainer}>
      <div className={styles.buttonContainer}>
        <Link to="/app/journal" className={styles.link}>
          <button className={styles.button}>Journal</button>
        </Link>
        <Link to="/app/clients" className={styles.link}>
          <button className={styles.button}>Kunder</button>
        </Link>
        </div>
        <br></br>
        <div className={styles.buttonContainer}>
        <Link to="/app/treatments" className={styles.link}>
          <button className={styles.button}>Behandlingar</button>
        </Link>
        <Link to="/app/machines" className={styles.link}>
          <button className={styles.button}>Maskiner</button>
        </Link>
      </div>
    </div>
    </div>
  );
};

export default Index;