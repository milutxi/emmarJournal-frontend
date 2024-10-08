import { Machine } from "../../types";
import styles from "./listMachines.module.scss";
import { Link } from "react-router-dom";

interface Props {
  machine: Machine;
}

const ListMachines = ({ machine }: Props) => {
  return (
    <div className={styles.list} key={machine._id}>
      <Link to={`/app/machines/${machine._id}`} className={styles["list__data"]}>
        <button>{machine.mName}</button>
      </Link>
    </div>
  )
}

export default ListMachines;
