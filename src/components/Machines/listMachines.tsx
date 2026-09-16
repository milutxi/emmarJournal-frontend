import { Machine } from "../../types";
import styles from "./listMachines.module.scss";
import { Link } from "react-router-dom";

interface Props {
  machine: Machine;
}

const ListMachines = ({ machine }: Props) => {
  return (
    <article className={styles.card}>
      <Link to={`/app/machines/${machine._id}`} className={styles.card__link}>
        <div className={styles.card__header}>
          <h3>{machine.mName}</h3>
        </div>

        <div className={styles.card__body}>
          <div className={styles.card__row}>
            <span className={styles.card__label}>Tillverkare</span>
            <span className={styles.card__value}>
              {machine.mManufactureCompany || "-"}
            </span>
          </div>

          <div className={styles.card__row}>
            <span className={styles.card__label}>Modell</span>
            <span className={styles.card__value}>
              {machine.mModelNumber || "-"}
            </span>
          </div>

          <div className={styles.card__row}>
            <span className={styles.card__label}>Serienummer</span>
            <span className={styles.card__value}>
              {machine.mSerialNumber || "-"}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ListMachines;