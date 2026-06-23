//import styles from "./medicalHistoryModal.module.scss";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const medicalHistoryModal = ({ onClose, isOpen }: Props) => {
  if (!isOpen) return null;

  return(

    <div>
      <h2>Medicinsk Hälsodeklaration</h2>

      <button onClick={onClose}>Stängt</button>
    </div>
  );
};

export default medicalHistoryModal;
