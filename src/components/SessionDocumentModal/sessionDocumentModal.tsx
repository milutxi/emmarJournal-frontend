import { Journal } from "../../types";
import styles from "./sessionDocumentModal.module.scss";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  journal: Journal | null;
  clientName: string;
};

const formatDate = (date?: string) => {
  if(!date) return "-";

  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("sv-SE").format(parsed);
};

const getTreatmentName = (
  treatment: Journal["treatments"][number][treatmentId],
) => {
  if (typeof treatment === "string") {
    return "Behandling";
  }

  return treatment.tname || "Behandling";
};

const getMedicalHistory = (journal: Journal) => {
  if (typeof journal.medicalHistoryId === "string") {
    return null;
  }

  return journal.medicalHistoryId;
};

const getConsentForm = (journal: Journal) => {
  if (typeof journal.consentFormId === "string") {
    return null;
  }

  return journal.consentFormId;
};

const SessionDocumentModal = ({
    isOpen,
    onClose,
    journal, 
    clientName,
  }: Props) => {

    if (!isOpen || !journal) return null;

    const medicalHistory = getMedicalHistory(journal);
  const consentForm = getConsentForm(journal);

  return (
<div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div>
            <p className={styles.kicker}>Behandlingsjournal</p>
            <h2>{clientName}</h2>
            <p className={styles.date}>{formatDate(journal.jDate)}</p>
          </div>

          <button type="button" className={styles.closeButton} onClick={onClose}>
            Stäng
          </button>
        </div>

        <div className={styles.content}>
          {/* SESSION */}
          <section className={styles.section}>
            <h3>Session</h3>

            {journal.treatments.map((session, index) => (
              <div key={`${journal._id}-${index}`} className={styles.treatment}>
                <div className={styles.row}>
                  <span>Behandling</span>
                  <strong>{getTreatmentName(session.treatmentId)}</strong>
                </div>

                <div className={styles.row}>
                  <span>Tid</span>
                  <strong>{session.duration} min</strong>
                </div>

                <div className={styles.row}>
                  <span>Pris</span>
                  <strong>{session.price} kr</strong>
                </div>

                <div className={styles.row}>
                  <span>Rabatt</span>
                  <strong>{session.discount ?? 0} kr</strong>
                </div>

                <div className={styles.row}>
                  <span>Total</span>
                  <strong>{session.totalPrice} kr</strong>
                </div>

                {session.notes && (
                  <div className={styles.notes}>
                    <span>Anteckning</span>
                    <p>{session.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </section>

          {/* MEDICAL HISTORY */}
          <section className={styles.section}>
            <h3>Hälsodeklaration</h3>

            {!medicalHistory ? (
              <p className={styles.emptyText}>Hälsodeklarationen kunde inte visas.</p>
            ) : (
              <>
                {"version" in medicalHistory && medicalHistory.version && (
                  <div className={styles.row}>
                    <span>Version</span>
                    <strong>{medicalHistory.version}</strong>
                  </div>
                )}

                <div className={styles.row}>
                  <span>Signerad</span>
                  <strong>{formatDate(medicalHistory.signedAt)}</strong>
                </div>

                {medicalHistory.pregnant && (
                  <div className={styles.row}>
                    <span>Gravid</span>
                    <strong>Ja</strong>
                  </div>
                )}

                {medicalHistory.breastfeeding && (
                  <div className={styles.row}>
                    <span>Ammar</span>
                    <strong>Ja</strong>
                  </div>
                )}

                {medicalHistory.diabetic && (
                  <div className={styles.row}>
                    <span>Diabetes</span>
                    <strong>Ja</strong>
                  </div>
                )}

                {medicalHistory.allergies && (
                  <div className={styles.row}>
                    <span>Allergier</span>
                    <strong>{medicalHistory.allergyDetails || "Ja"}</strong>
                  </div>
                )}

                {medicalHistory.medication && (
                  <div className={styles.row}>
                    <span>Medicinering</span>
                    <strong>{medicalHistory.medicationDetails || "Ja"}</strong>
                  </div>
                )}

                {medicalHistory.bloodThinners && (
                  <div className={styles.row}>
                    <span>Blodförtunnande</span>
                    <strong>{medicalHistory.bloodThinnerDetails || "Ja"}</strong>
                  </div>
                )}

                {medicalHistory.otherConditions && (
                  <div className={styles.notes}>
                    <span>Övriga tillstånd</span>
                    <p>{medicalHistory.otherConditions}</p>
                  </div>
                )}

                {medicalHistory.mhnotes && (
                  <div className={styles.notes}>
                    <span>Anteckningar</span>
                    <p>{medicalHistory.mhnotes}</p>
                  </div>
                )}

                {medicalHistory.signatureImage && (
                  <div className={styles.signatureBlock}>
                    <span>Kundens underskrift</span>
                    <img
                      src={medicalHistory.signatureImage}
                      alt="Kundens underskrift"
                    />
                  </div>
                )}
              </>
            )}
          </section>

          {/* CONSENT FORM */}
          <section className={styles.section}>
            <h3>Samtycke</h3>

            {!consentForm ? (
              <p className={styles.emptyText}>Samtycket kunde inte visas.</p>
            ) : (
              <>
                <div className={styles.row}>
                  <span>Signerat</span>
                  <strong>{formatDate(consentForm.signedAt)}</strong>
                </div>

                <div className={styles.notes}>
                  <span>Samtyckestext</span>
                  <p>{consentForm.consentText}</p>
                </div>

                {consentForm.signatureImage && (
                  <div className={styles.signatureBlock}>
                    <span>Kundens underskrift</span>
                    <img
                      src={consentForm.signatureImage}
                      alt="Kundens underskrift"
                    />
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default SessionDocumentModal;