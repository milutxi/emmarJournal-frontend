import { Machine } from "../../types";
import styles from "./listMachines.module.scss";
import { RiDeleteBinLine } from "react-icons/ri";
import { GrEdit } from "react-icons/gr";
import { Link } from "react-router-dom";

interface Props {
  machine: Machine;
  deleteMachine: (id: string) => void;
  onEdit: (machine: Machine) => void;
}

const ListMachines = ({ machine, deleteMachine, onEdit }: Props) => {
  return (
    <div className={styles.card}>
      <div className={styles.card__header}>
        <h3>{machine.mName}</h3>
      </div>

      <Link to={`/app/machines/${machine._id}`} className={styles.card__body}>
        <p>
          <strong>Company:</strong> {machine.mManufactureCompany}
        </p>
        <p>
          <strong>Model:</strong> {machine.mModelNumber}
        </p>
        <p>
          <strong>Serial:</strong> {machine.mSerialNumber}
        </p>
      </Link>

      <div className={styles.card__actions}>
        <section className={styles.card__edit}>
          <GrEdit />
        </section>

        <section
          className={styles.card__delete}
          onClick={() => deleteMachine(machine._id)}
        >
          <RiDeleteBinLine />
        </section>
      </div>
    </div>
  );
};

export default ListMachines;
