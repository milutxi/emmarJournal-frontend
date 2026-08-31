import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import styles from "./userMenu.module.scss";
import { useAuth } from "../../context/authContext";

const UserMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) return null;

  return (
    <div className={styles.userMenu} ref={menuRef}>
      <button
        type="button"
        className={styles.userButton}
        onClick={() => setIsOpen((current) => !current)}
        aria-label="Öppna användarmeny"
      >
        <FaRegUserCircle />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.userInfo}>
            <strong>{user.name}</strong>
            <span>{user.role === "admin" ? "Admin" : "Personal"} </span>
          </div>

          <button
            type="button"
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            Logga ut
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
