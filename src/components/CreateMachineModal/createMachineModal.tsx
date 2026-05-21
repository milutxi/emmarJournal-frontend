import styles from "./createMachineModal.module.scss";
import { useState } from "react";
import BasicInfoStep from "./steps/basicInfoStep";

type Props = {
  onClose: () => void;
};

const CreateMachineModal = ({ onClose }: Props) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    mName: "",
    mModelNumber: "",
    mSerialNumber: "",
    mManufactureCompany: "",
    mManufactureYear: "",
    mDescription: "",
  });

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          x
        </button>
        <h1>Ny maskin</h1>

        <div className={styles.stepContent}>
          {step === 1 && (
            <BasicInfoStep formData={formData} setFormData={setFormData} />
          )}

          {step === 2 && <h2>Anskaffning</h2>}
          {step === 3 && <h2>Service</h2>}
          {step === 4 && <h2>Kommentarer</h2>}
        </div>

        <div className={styles.actions}>
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)}>Tillbaka</button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button onClick={() => setStep(step + 1)}>Nästa</button>
          ) : (
            <button>Skapa maskin</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateMachineModal;
