import { Journal } from "../../types";
import styles from "./sessionDocumentModal.module.scss";

import {
  medicalHistoryBooleanGroups,
  medicalHistoryTextFields,
} from "../../config/medicalHistoryFields";

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
          <section className={styles.section}>
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
                        {treatmentParameters.wavelength && (
                          <p>
                            <strong>Våglängd:</strong>{" "}
                            {treatmentParameters.wavelength}
                          </p>
                        )}

                        {treatmentParameters.pulseMode && (
                          <p>
                            <strong>Pulsläge:</strong>{" "}
                            {treatmentParameters.pulseMode}
                          </p>
                        )}

                        {treatmentParameters.energyDensity && (
                          <p>
                            <strong>Energitäthet:</strong>{" "}
                            {treatmentParameters.energyDensity}
                          </p>
                        )}

                        {treatmentParameters.pulseEnergy && (
                          <p>
                            <strong>Pulsenergi:</strong>{" "}
                            {treatmentParameters.pulseEnergy}
                          </p>
                        )}

                        {treatmentParameters.spotSize && (
                          <p>
                            <strong>Spotstorlek:</strong>{" "}
                            {treatmentParameters.spotSize}
                          </p>
                        )}

                        {treatmentParameters.frequency && (
                          <p>
                            <strong>Frekvens:</strong>{" "}
                            {treatmentParameters.frequency}
                          </p>
                        )}

                        {treatmentParameters.pulseDuration && (
                          <p>
                            <strong>Pulslängd:</strong>{" "}
                            {treatmentParameters.pulseDuration}
                          </p>
                        )}

                        {typeof treatmentParameters.coolingUsed ===
                          "boolean" && (
                          <p>
                            <strong>Kylning:</strong>{" "}
                            {treatmentParameters.coolingUsed ? "Ja" : "Nej"}
                          </p>
                        )}

                        {treatmentParameters.tpComment && (
                          <p>
                            <strong>Kommentar:</strong>{" "}
                            {treatmentParameters.tpComment}
                          </p>
                        )}
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
          </section>

          {/* MEDICAL HISTORY */}
          <section className={styles.section}>
            <h3>Hälsodeklaration</h3>

            {!medicalHistory ? (
              <p className={styles.emptyText}>
                Hälsodeklarationen kunde inte visas.
              </p>
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
                {medicalHistoryBooleanGroups.map((group) => (
                  <div key={group.title} className={styles.medicalHistoryGroup}>
                    <h4>{group.title}</h4>

                    {group.fields.map((field) => {
                      const value = medicalHistory[field.key];
                      const detailKey = field.detailKey;
                      const detailValue = detailKey
                        ? medicalHistory[detailKey]
                        : undefined;

                      const detailText =
                        typeof detailValue === "string" && detailValue.trim()
                          ? detailValue
                          : "";

                      return (
                        <div key={String(field.key)} className={styles.row}>
                          <span>{field.label}</span>
                          <strong>
                            {value ? "Ja" : "Nej"}
                            {value && detailText ? ` — ${detailText}` : ""}
                          </strong>
                        </div>
                      );
                    })}
                  </div>
                ))}
                {medicalHistoryTextFields.map((field) => {
                  const value = medicalHistory[field.key];

                  if (typeof value !== "string" || !value.trim()) {
                    return null;
                  }

                  return (
                    <div key={String(field.key)} className={styles.notes}>
                      <span>{field.label}</span>
                      <p>{value}</p>
                    </div>
                  );
                })}

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
