import { Consultation } from "../../types";
import { formatDisplayDate } from "../../utils/jounalHelpers";
import styles from "./consultationDocumentModal.module.scss";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  consultation: Consultation | null;
  clientName: string;
};

const ConsultationDocumentModal = ({
  isOpen,
  onClose,
  consultation,
  clientName,
}: Props) => {
  if (!isOpen || !consultation) return null;

  return (
    <div className={styles.consultationModalOverlay}>
      <div className={styles.consultationModal}>
        <div className={styles.header}>
          <div>
            <p className={styles.kicker}>Behandlingsjournal</p>
            <h2>{clientName}</h2>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            Stäng
          </button>
        </div>

        <div className={styles.content}>
          <section className={styles.sessionPanel}>
            <div className={styles.sessionHeader}>
              <div>
                <p className={styles.kicker}>Konsultation</p>
                <h3>{consultation.consultationTitle}</h3>
              </div>

              <span className={styles.sessionDate}>
                {" "}
                {formatDisplayDate(consultation.consultationDate)}
              </span>
            </div>

            <div className={styles.consultationModalText}>
              {consultation.consultationText}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ConsultationDocumentModal;
