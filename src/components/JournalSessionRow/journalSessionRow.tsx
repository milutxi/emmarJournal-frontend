import { Journal } from "../../types";
import { formatJournalDate,
  getJournalClientName,
  getJournalTreatmentNames,
  hasJournalConsentForm,
  hasJournalMedicalHistory, } from "../../utils/jounalHelpers";
import styles from "./journalSessionRow.module.scss";

type Props = {
  journal: Journal;
  showClientName?: boolean;
  onOpen: (journal: Journal) => void;
};

const JournalSessionRow = ({ journal, showClientName = false, onOpen,}: Props) => {
  return (
    <li className={styles.journalSessionRow}>
      <button
        type="button"
        className={[
          styles.sessionButton,
          showClientName ? styles.sessionButtonWithClient : "",
        ].join(" ")}
        onClick={() => onOpen(journal)}
      >
        <span className={styles.journalDate}>
          {formatJournalDate(journal.jDate)}
        </span>

        {showClientName && (
          <span className={styles.clientName}>
            {getJournalClientName(journal)}
          </span>
        )}

        <span className={styles.treatmentName}>
          {getJournalTreatmentNames(journal)}
        </span>
      </button>

      <span
        className={
          hasJournalMedicalHistory(journal)
            ? styles.documentStatusComplete
            : styles.documentStatusMissing
        }
      >
        Hälsodeklaration
      </span>

      <span
        className={
          hasJournalConsentForm(journal)
            ? styles.documentStatusComplete
            : styles.documentStatusMissing
        }
      >
        Samtycke
      </span>
    </li>
  );
};

export default JournalSessionRow;