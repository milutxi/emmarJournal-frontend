import styles from "./createMachineModal.module.scss";
import { useState } from "react";

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
            <div className={styles.formSection}>
              <h2>Grundinformation</h2>
              <div className={styles.rowOne}>
                <div className={styles.inputGroup}>
                  <label>Namn</label>

                  <input
                    type="text"
                    value={formData.mName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Modellnummer</label>

                  <input
                    type="text"
                    value={formData.mModelNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mModelNumber: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Serienummer</label>

                  <input
                    type="text"
                    value={formData.mSerialNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mSerialNumber: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className={styles.rowTwo}>
                <div className={styles.inputGroup}>
                  <label>Tillverkare</label>

                  <input
                    type="text"
                    value={formData.mManufactureCompany}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mManufactureCompany: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Tillverkningsår</label>

                  <input
                    type="date"
                    value={formData.mManufactureYear}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mManufactureYear: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Beskrivning</label>

                <textarea
                  rows={5}
                  value={formData.mDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mDescription: e.target.value,
                    })
                  }
                />
              </div>
            </div>
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
