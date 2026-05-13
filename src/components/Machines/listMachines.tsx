import { Machine } from "../../types";
import styles from "./listMachines.module.scss";
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

      <div className={styles.card__body}>
        <p><strong>Company:</strong> {machine.mManufactureCompany}</p>
        <p><strong>Model:</strong> {machine.mModelNumber}</p>
        <p><strong>Serial:</strong> {machine.mSerialNumber}</p>
      </div>

      <div className={styles.card__actions}>
        <button onClick={() => onEdit(machine)}>Edit</button>
        <button onClick={() => deleteMachine(machine._id)}>Delete</button>
      </div>
    </div>
  );
};

export default ListMachines;
