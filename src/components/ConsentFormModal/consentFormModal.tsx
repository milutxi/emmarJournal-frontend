import styles from "./consentFormModal.module.scss";

import { ConsentFormType } from "../../types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  consentForm: ConsentFormType;
  setConsentForm: React.Dispatch<React.SetStateAction<ConsentFormType>>;
  setConsentFormCompleted: React.Dispatch<React.SetStateAction<boolean>>;
};
const ConsentFormModal = ({
  isOpen,
  onClose,
  consentForm,
  setConsentForm,
  setConsentFormCompleted,
}: Props) => {
  if (!isOpen) return null;

  const handleSaveConsentForm = () => {
    if(!consentForm.accepted) return;
    
    setConsentFormCompleted(true);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <button className={styles.closeButton} onClick={onClose}>
            X
          </button>
          <h2 className={styles.title}>Samtyckesformulär</h2>
        </div>
        <div className={styles.modalBody}>
          <input
            type="checkbox"
            checked={consentForm.accepted}
            onChange={(e) =>
              setConsentForm({
                ...consentForm,
                accepted: e.target.checked,
              })
            }
          />

          <label>Jag har läst och förstått informationen</label>
          <div className={styles.buttonSection}>
            <button className={styles.cancelButton} onClick={onClose}>
              Avbryt
            </button>
            <button
              className={styles.saveButton}
              onClick={handleSaveConsentForm}
            >
              Spara
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentFormModal;
