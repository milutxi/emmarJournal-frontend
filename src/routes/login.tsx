import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import styles from "./login.module.scss";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      setErrorMessage("");

      await login(email, password);

      navigate("/app/journal");
    } catch (error: any) {
      setErrorMessage(error.message || "Kunde inte logga in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <img
          className={styles.logo}
          src="https://assets-global.website-files.com/6394edc1cd797257200998bc/63963420883c851c66e77a08_emmar%20beauty%20logo.svg"
          alt="Emmar Beauty logo"
        />

        <p className={styles.kicker}>Personalinloggning</p>
        <h1>Logga in</h1>

         <form onSubmit={handleLogin} className={styles.loginForm}>
          <label>
            E-post
            <input
              type="email"
              value={email}
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Lösenord
            <input
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Loggar in..." : "Logga in"}
          </button>
        </form>

        <Link to="/" className={styles.backLink}>
          Tillbaka
        </Link>
      </div>
    </div>
  );
};

export default Login;
