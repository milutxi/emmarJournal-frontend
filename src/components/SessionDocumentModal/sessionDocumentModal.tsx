import { Journal } from "../../types";
import styles from "./sessionDocumentModal.module.scss";

import {
  medicalHistoryBooleanGroups,
  medicalHistoryTextFields,
} from "../../config/medicalHistoryFields";
import { treatmentParameterFields } from "../../config/treatmentParameterFields";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  journal: Journal | null;
  clientName: string;
};

const formatDate = (date?: string) => {
  if (!date) return "-";

  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("sv-SE").format(parsed);
};

const getTreatmentName = (
  treatment: Journal["treatments"][number]["treatmentId"],
) => {
  if (typeof treatment === "string") {
    return "Behandling";
  }

  return treatment.tname || "Behandling";
};

const getMachineName = (
  machine: Journal["treatments"][number]["machineIds"][number],
) => {
  if (typeof machine === "string") {
    return machine;
  }

  return machine.mName || "Maskin";
};

const getTreatmentParameters = (
  parameters: Journal["treatments"][number]["treatmentParametersId"],
) => {
  if (!parameters || typeof parameters === "string") {
    return null;
  }

  return parameters;
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

  const totalDuration = journal.treatments.reduce(
  (sum, session) => sum + (session.duration ?? 0),
  0,
);

const totalPrice = journal.treatments.reduce(
  (sum, session) => sum + (session.price ?? 0),
  0,
);

const totalDiscount = journal.treatments.reduce(
  (sum, session) => sum + (session.discount ?? 0),
  0,
);

const grandTotal = journal.treatments.reduce(
  (sum, session) => sum + (session.totalPrice ?? 0),
  0,
);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div>
            <p className={styles.kicker}>Behandlingsjournal</p>
            <h2>{clientName}</h2>
            <p className={styles.date}>{formatDate(journal.jDate)}</p>
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
          {/* SESSION */}
          {/* <section className={styles.section}>
            <h3>Session</h3>

            {journal.treatments.map((session, index) => {
              const treatmentParameters = getTreatmentParameters(
                session.treatmentParametersId,
              );

              return (
                <div
                  key={`${journal._id}-${index}`}
                  className={styles.treatment}
                >
                  <div className={styles.row}>
                    <span>Behandling</span>
                    <strong>{getTreatmentName(session.treatmentId)}</strong>
                  </div>

                  {session.machineIds.length > 0 && (
                    <div className={styles.notes}>
                      <span>Maskiner</span>
                      <p>
                        {session.machineIds
                          .map((machine) => getMachineName(machine))
                          .join(", ")}
                      </p>
                    </div>
                  )}

                  {treatmentParameters && (
                    <div className={styles.parameterBlock}>
                      <span>Laserparametrar</span>

                      <div className={styles.parameterGrid}>
                        {treatmentParameterFields.map((field) => {
                          const value = treatmentParameters[field.key];

                          if (field.type === "boolean") {
                            return (
                              <p key={String(field.key)}>
                                <strong>{field.label}:</strong>{" "}
                                {value ? "Ja" : "Nej"}
                              </p>
                            );
                          }

                          if (typeof value !== "string" || !value.trim()) {
                            return null;
                          }

                          return (
                            <p key={String(field.key)}>
                              <strong>{field.label}:</strong> {value}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  )}

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
              );
            })}

          </section> */}

          {/* SESSION */}
<section className={styles.sessionPanel}>
  <div className={styles.sessionHeader}>
    <div>
      <p className={styles.sectionKicker}>Journal</p>
      <h3>Session</h3>
    </div>

    <span className={styles.sessionDate}>{formatDate(journal.jDate)}</span>
  </div>

  <div className={styles.sessionTable}>
    <div className={styles.sessionTableHeader}>
      <span>Behandling</span>
      <span>Tid</span>
      <span>Pris</span>
      <span>Rabatt</span>
      <span>Total</span>
    </div>

    {journal.treatments.map((session, index) => {
      const treatmentParameters = getTreatmentParameters(
        session.treatmentParametersId,
      );

      return (
         <div key={`${journal._id}-${index}`} className={styles.sessionItem}>
    <div className={styles.sessionSummaryRow}>
      <div className={styles.sessionTreatmentName}>
        {getTreatmentName(session.treatmentId)}
      </div>

      <div className={styles.sessionNumber}>{session.duration} min</div>
      <div className={styles.sessionNumber}>{session.price} kr</div>
      <div className={styles.sessionNumber}>{session.discount ?? 0} kr</div>
      <div className={styles.sessionNumberStrong}>{session.totalPrice} kr</div>
    </div>

    {(session.machineIds.length > 0 || treatmentParameters || session.notes) && (
      <div className={styles.sessionDetailsBlock}>
        {session.machineIds.length > 0 && (
          <div className={styles.sessionInfoBlock}>
            <span>Maskiner</span>
            <p>
              {session.machineIds
                .map((machine) => getMachineName(machine))
                .join(", ")}
            </p>
          </div>
        )}

        {treatmentParameters && (
          <div className={styles.sessionInfoBlock}>
            <span>Laserparametrar</span>

            <div className={styles.sessionParameterGrid}>
              {treatmentParameterFields.map((field) => {
                const value = treatmentParameters[field.key];

                if (field.type === "boolean") {
                  return (
                    <p key={String(field.key)}>
                      <strong>{field.label}:</strong> {value ? "Ja" : "Nej"}
                    </p>
                  );
                }

                if (typeof value !== "string" || !value.trim()) {
                  return null;
                }

                return (
                  <p key={String(field.key)}>
                    <strong>{field.label}:</strong> {value}
                  </p>
                );
              })}
            </div>
          </div>
        )}

        {session.notes && (
          <div className={styles.sessionInfoBlock}>
            <span>Anteckning</span>
            <p>{session.notes}</p>
          </div>
        )}
      </div>
    )}
  </div>
      );
    })}

    <div className={styles.sessionTotalRow}>
      <div className={styles.sessionTotalLabel}>Totalt Session</div>
      <div>{totalDuration} min</div>
      <div>{totalPrice} kr</div>
      <div>{totalDiscount} kr</div>
      <strong>{grandTotal} kr</strong>
    </div>
  </div>
</section>

          {/* MEDICAL HISTORY */}

          <section className={styles.medicalHistoryPanel}>
            <div className={styles.medicalHistoryHeader}>
              <div>
                <p className={styles.sectionKicker}>Dokument</p>
                <h3>Hälsodeklaration</h3>
              </div>

              {medicalHistory &&
                "version" in medicalHistory &&
                medicalHistory.version && (
                  <span className={styles.versionBadge}>
                    Version {medicalHistory.version}
                  </span>
                )}
            </div>

            {!medicalHistory ? (
              <p className={styles.emptyText}>
                Hälsodeklarationen kunde inte visas.
              </p>
            ) : (
              <>
                <div className={styles.medicalHistoryGroups}>
                  {medicalHistoryBooleanGroups.map((group) => (
                    <div
                      key={group.title}
                      className={styles.medicalHistoryGroup}
                    >
                      <h4>{group.title}</h4>

                      <div className={styles.medicalHistoryItems}>
                        {group.fields.map((field) => {
                          const value = medicalHistory[field.key];
                          const detailKey = field.detailKey;
                          const detailValue = detailKey
                            ? medicalHistory[detailKey]
                            : undefined;

                          const detailText =
                            typeof detailValue === "string" &&
                            detailValue.trim()
                              ? detailValue
                              : "";

                          return (
                            <div
                              key={String(field.key)}
                              className={[
                                styles.medicalHistoryItem,
                                value
                                  ? styles.medicalHistoryItemPositive
                                  : styles.medicalHistoryItemNegative,
                              ].join(" ")}
                            >
                              <span>{field.label}</span>

                              <strong>
                                {value ? "Ja" : "Nej"}
                                {value && detailText ? ` — ${detailText}` : ""}
                              </strong>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.medicalHistoryTextFields}>
                  {medicalHistoryTextFields.map((field) => {
                    const value = medicalHistory[field.key];

                    if (typeof value !== "string" || !value.trim()) {
                      return null;
                    }

                    return (
                      <div
                        key={String(field.key)}
                        className={styles.medicalHistoryTextBlock}
                      >
                        <span>{field.label}</span>
                        <p>{value}</p>
                      </div>
                    );
                  })}
                </div>

                {medicalHistory.signatureImage && (
                  <div className={styles.medicalHistorySignature}>
                    <div className={styles.signatureImageBox}>
                      <img
                        src={medicalHistory.signatureImage}
                        alt="Kundens underskrift"
                      />
                    </div>

                    <div className={styles.signatureInfo}>
                      <span>Signerad av</span>
                      <strong>{clientName}</strong>
                      <p>{formatDate(medicalHistory.signedAt)}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>

          {/* CONSENT FORM */}

          <section className={styles.consentPanel}>
            <div className={styles.consentHeader}>
              <div>
                <p className={styles.sectionKicker}>Dokument</p>
                <h3>Samtycke</h3>
              </div>
            </div>

            {!consentForm ? (
              <p className={styles.emptyText}>Samtycket kunde inte visas.</p>
            ) : (
              <>
                <div className={styles.consentTextBlock}>
                  <span>Samtyckestext</span>
                  <p>{consentForm.consentText}</p>
                </div>

                {consentForm.signatureImage && (
                  <div className={styles.consentSignature}>
                    <div className={styles.signatureImageBox}>
                      <img
                        src={consentForm.signatureImage}
                        alt="Kundens underskrift"
                      />
                    </div>

                    <div className={styles.signatureInfo}>
                      <span>Signerad av</span>
                      <strong>{clientName}</strong>
                      <p>{formatDate(consentForm.signedAt)}</p>
                    </div>
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
