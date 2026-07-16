import styles from "./editTreatmentSession.module.scss";

import { useState, useEffect, useCallback } from "react";
import {
  Link,
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import {
  Client,
  Journal,
  Machine,
  Treatment,
  TreatmentSession,
  ConsentFormType,
  MedicalHistoryType,
} from "../types";
import {
  treatmentParameterFields,
  treatmentParameterTextFields,
} from "../config/treatmentParameterFields";

import MedicalHistoryModal from "../components/MedicalHistoryModal/medicalHistoryModal";
import ConsentFormModal from "../components/ConsentFormModal/consentFormModal";
import { emptyMedicalHistory } from "../defaults/emptyMedicalHistory";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id, journalId } = params;

  const [
    clientResponse,
    treatmentsResponse,
    machinesResponse,
    journalsResponse,
    medicalHistoryResponse,
  ] = await Promise.all([
    fetch(import.meta.env.VITE_BACKEND_URL + "/clients/" + id),
    fetch(import.meta.env.VITE_BACKEND_URL + "/treatment/"),
    fetch(import.meta.env.VITE_BACKEND_URL + "/machine/"),
    fetch(import.meta.env.VITE_BACKEND_URL + "/journals/client/" + id),
    fetch(import.meta.env.VITE_BACKEND_URL + "/medicalHistory/latest/" + id),
  ]);

  const client = await clientResponse.json();
  const treatments = await treatmentsResponse.json();
  const machines = await machinesResponse.json();
  const journals = await journalsResponse.json();
  const latestMedicalHistory = await medicalHistoryResponse.json();

  const journal = journals.find(
    (journal: Journal) => journal._id === journalId,
  );

  if (!journal) {
    throw new Response("Journal session not found", { status: 404 });
  }

  return {
    client,
    treatments,
    machines,
    journal,
    latestMedicalHistory,
  };
};

const getId = (value: string | { _id: string }) => {
  if (typeof value === "string") return value;
  return value._id;
};

const getTreatmentParametersForEdit = (
  parameters: Journal["treatments"][number]["treatmentParametersId"],
) => {
  if (!parameters || typeof parameters === "string") return undefined;

  const editableParameters = Object.fromEntries(
    Object.entries(parameters).filter(
      ([key]) => !["_id", "createdAt", "updatedAt", "__v"].includes(key),
    ),
  );

  return editableParameters;
};

const EditTreatmentSession = () => {
  const { client, treatments, machines, journal, latestMedicalHistory } = useLoaderData() as {
    client: Client;
    treatments: Treatment[];
    machines: Machine[];
    journal: Journal;
    latestMedicalHistory: MedicalHistoryType | null;
  };

  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const [treatmentSessions, setTreatmentSessions] = useState<
    TreatmentSession[]
  >(
    journal.treatments.map((session) => ({
      treatmentId: getId(session.treatmentId),
      machineIds: session.machineIds.map((machine) => getId(machine)),
      treatmentParameters: getTreatmentParametersForEdit(
        session.treatmentParametersId,
      ),
      duration: session.duration,
      price: session.price,
      discount: session.discount ?? 0,
      totalPrice: session.totalPrice,
      notes: session.notes ?? "",
    })),
  );

  const [sessionDate, setSessionDate] = useState(
    journal.jDate ? journal.jDate.slice(0, 10) : "",
  );

  const [showMedicalHistory, setShowMedicalHistory] = useState(false);
  const [showConsentForm, setShowConsentForm] = useState(false);

  const [attachedMedicalHistoryId, setAttachedMedicalHistoryId] = useState<
    string | null
  >(
    journal.medicalHistoryId && typeof journal.medicalHistoryId === "object"
      ? journal.medicalHistoryId._id ?? null
      : typeof journal.medicalHistoryId === "string"
        ? journal.medicalHistoryId
        : null,
  );

  const [attachedConsentFormId, setAttachedConsentFormId] = useState<
    string | null
  >(
    journal.consentFormId && typeof journal.consentFormId === "object"
      ? journal.consentFormId._id ?? null
      : typeof journal.consentFormId === "string"
        ? journal.consentFormId
        : null,
  );

  const initialMedicalHistory: MedicalHistoryType = latestMedicalHistory
    ? {
        ...emptyMedicalHistory,
        ...latestMedicalHistory,
        consentAccepted: false,
        signatureImage: "",
        signedAt: undefined,
      }
    : emptyMedicalHistory;

  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryType>(
    initialMedicalHistory,
  );

  const [consentForm, setConsentForm] = useState<ConsentFormType>({
    treatmentIds: [],
    consentText: "",
    accepted: false,
    signatureImage: "",
  });

  const [, setConsentFormCompleted] = useState(false);

  const hasMedicalHistory = Boolean(attachedMedicalHistoryId);
  const hasConsentForm = Boolean(attachedConsentFormId);

  const attachDocumentToJournal = useCallback (
     async (documents: {
    medicalHistoryId?: string;
    consentFormId?: string;
  }) => {
    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/journals/" + journal._id,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(documents),
      },
    );

    if (!response.ok) {
      throw new Error("Could not attach document to journal");
    }

    return response.json();
  },
  [journal._id],
);

  const handleSaveMedicalHistory = async (
    updatedMedicalHistory: MedicalHistoryType,
  ) => {
    try {
      const payload = {
        ...updatedMedicalHistory,
        clientId: client._id,
      };

      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/medicalHistory",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("Could not save medical history");
      }

      const savedMedicalHistory = await response.json();

      await attachDocumentToJournal({
        medicalHistoryId: savedMedicalHistory._id,
      });

      setMedicalHistory(savedMedicalHistory);
      setAttachedMedicalHistoryId(savedMedicalHistory._id);
      setShowMedicalHistory(false);
    } catch (error) {
      console.error("Save medical history error:", error);
      alert("Kunde inte spara hälsodeklarationen.");
    }
  };

  useEffect(() => {
    if (!consentForm._id || attachedConsentFormId) return;
const consentFormId = consentForm._id;
    const attachConsentForm = async () => {
      try {
        await attachDocumentToJournal({
          consentFormId,
        });

        setAttachedConsentFormId(consentFormId);
        setShowConsentForm(false);
      } catch (error) {
        console.error("Attach consent form error:", error);
        alert("Samtycket sparades, men kunde inte kopplas till journalen.");
      }
    };

    attachConsentForm();
  }, [consentForm._id, attachedConsentFormId, attachDocumentToJournal]);

  const updateTreatmentSession = (
    index: number,
    updatedSession: TreatmentSession,
  ) => {
    setTreatmentSessions((currentSessions) =>
      currentSessions.map((session, sessionIndex) =>
        sessionIndex === index ? updatedSession : session,
      ),
    );
  };

  const handleSaveJournal = async () => {
    try {
      setIsSaving(true);

      const payload = {
        jDate: sessionDate,
        treatments: treatmentSessions,
      };

      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/journals/" + journal._id,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("Could not update journal session");
      }

      navigate(`/app/clients/${client._id}`);
    } catch (error) {
      console.error("Update journal error:", error);
      alert("Kunde inte spara ändringarna.");
    } finally {
      setIsSaving(false);
    }
  };

  const totalDuration = treatmentSessions.reduce(
    (sum, session) => sum + session.duration,
    0,
  );

  const totalPrice = treatmentSessions.reduce(
    (sum, session) => sum + session.totalPrice,
    0,
  );

  return (
    <div className={styles.editTreatmentStyle}>
      <div className={styles.editTreatmentStyle__left}>
        <div className={styles.sessionHeader}>
          <Link
            to={`/app/clients/${client._id}`}
            className={styles.sessionHeaderLink}
          >
            <div>
              <h1>Redigera Session</h1>
              <h2>
                {client.name} {client.lastName}
              </h2>
            </div>
          </Link>

          <input
            type="date"
            value={sessionDate}
            onChange={(event) => setSessionDate(event.target.value)}
          />
        </div>

        {treatmentSessions.map((session, index) => {
          return (
            <div key={index} className={styles.treatmentCard}>
              <h2>Behandling {index + 1}</h2>

              <div className={styles.sessionTable}>
                <div className={styles.sessionTableHeader}>
                  <span>Behandling</span>
                  <span>Tid</span>
                  <span>Pris</span>
                  <span>Rabatt</span>
                  <span>Total</span>
                </div>

                <div className={styles.sessionSummaryRow}>
                  <label>
                    <select
                      value={session.treatmentId}
                      onChange={(event) => {
                        const selectedTreatment = treatments.find(
                          (treatment) => treatment._id === event.target.value,
                        );

                        const price =
                          selectedTreatment?.tprice ?? session.price;
                        const duration =
                          selectedTreatment?.tduration ?? session.duration;
                        const discount = session.discount ?? 0;

                        updateTreatmentSession(index, {
                          ...session,
                          treatmentId: event.target.value,
                          price,
                          duration,
                          totalPrice: price - discount,
                        });
                      }}
                    >
                      <option value="">Välj behandling</option>

                      {treatments.map((treatment) => (
                        <option key={treatment._id} value={treatment._id}>
                          {treatment.tname}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <input
                      type="number"
                      value={session.duration}
                      onChange={(event) =>
                        updateTreatmentSession(index, {
                          ...session,
                          duration: Number(event.target.value),
                        })
                      }
                    />
                  </label>

                  <label>
                    <input
                      type="number"
                      value={session.price}
                      onChange={(event) => {
                        const price = Number(event.target.value);
                        const discount = session.discount ?? 0;

                        updateTreatmentSession(index, {
                          ...session,
                          price,
                          totalPrice: price - discount,
                        });
                      }}
                    />
                  </label>

                  <label>
                    <input
                      type="number"
                      value={session.discount}
                      onChange={(event) => {
                        const discount = Number(event.target.value);

                        updateTreatmentSession(index, {
                          ...session,
                          discount,
                          totalPrice: session.price - discount,
                        });
                      }}
                    />
                  </label>

                  <div className={styles.totalPreview}>
                    {session.totalPrice} kr
                  </div>
                </div>
              </div>

              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>Maskiner</h4>

                <div className={styles.machineGrid}>
                  {machines.map((machine) => {
                    const isChecked = session.machineIds.includes(machine._id);

                    return (
                      <label key={machine._id} className={styles.machineOption}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(event) => {
                            const machineIds = event.target.checked
                              ? [...session.machineIds, machine._id]
                              : session.machineIds.filter(
                                  (machineId) => machineId !== machine._id,
                                );

                            updateTreatmentSession(index, {
                              ...session,
                              machineIds,
                            });
                          }}
                        />
                        {machine.mName}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className={styles.formSection}>
                <h4 className={styles.formSectionTitle}>
                  Behandlingsparametrar
                </h4>

                <div className={styles.parameterGrid}>
                  {treatmentParameterFields.map((field) => {
                    if (field.type === "boolean") {
                      return (
                        <label key={field.key} className={styles.booleanField}>
                          <span className={styles.parameterLabel}>
                            {field.label}
                          </span>
                          <input
                            type="checkbox"
                            checked={Boolean(
                              session.treatmentParameters?.[field.key],
                            )}
                            onChange={(event) =>
                              updateTreatmentSession(index, {
                                ...session,
                                treatmentParameters: {
                                  ...session.treatmentParameters,
                                  [field.key]: event.target.checked,
                                },
                              })
                            }
                          />
                        </label>
                      );
                    }

                    return (
                      <label key={field.key} className={styles.parameterField}>
                        <span className={styles.parameterLabel}>
                          {field.label}
                        </span>

                        <input
                          type="text"
                          value={
                            (session.treatmentParameters?.[
                              field.key
                            ] as string) ?? ""
                          }
                          onChange={(event) =>
                            updateTreatmentSession(index, {
                              ...session,
                              treatmentParameters: {
                                ...session.treatmentParameters,
                                [field.key]: event.target.value,
                              },
                            })
                          }
                        />
                      </label>
                    );
                  })}

                  {treatmentParameterTextFields.map((field) => (
                    <label
                      key={field.key}
                      className={styles.parameterTextField}
                    >
                      {field.label}
                      <textarea
                        value={
                          (session.treatmentParameters?.[
                            field.key
                          ] as string) ?? ""
                        }
                        onChange={(event) =>
                          updateTreatmentSession(index, {
                            ...session,
                            treatmentParameters: {
                              ...session.treatmentParameters,
                              [field.key]: event.target.value,
                            },
                          })
                        }
                      />
                    </label>
                  ))}
                </div>
              </div>

              <label>
                Anteckningar
                <textarea
                  value={session.notes}
                  onChange={(event) =>
                    updateTreatmentSession(index, {
                      ...session,
                      notes: event.target.value,
                    })
                  }
                />
              </label>
            </div>
          );
        })}

        <button
          type="button"
          className={styles.saveButton}
          onClick={handleSaveJournal}
          disabled={isSaving}
        >
          {isSaving ? "Sparar..." : "Spara ändringar"}
        </button>
      </div>

      <aside className={styles.editTreatmentStyle__right}>
        <div className={styles.sessionSummary}>
          <h2>Sammanfattning</h2>

          <p>
            <span>Antal behandlingar</span>
            <strong>{treatmentSessions.length}</strong>
          </p>

          <p>
            <span>Total tid</span>
            <strong>{totalDuration} min</strong>
          </p>

          <p>
            <span>Total</span>
            <strong>{totalPrice} kr</strong>
          </p>
        </div>
        <div className={styles.documentActions}>
          {hasMedicalHistory ? (
            <div className={styles.documentStatus}>Hälsodeklaration finns</div>
          ) : (
            <button
              type="button"
              className={styles.documentButton}
              onClick={() => setShowMedicalHistory(true)}
            >
              Lägg till hälsodeklaration
            </button>
          )}

          {hasConsentForm ? (
            <div className={styles.documentStatus}>Samtycke finns</div>
          ) : (
            <button
              type="button"
              className={styles.documentButton}
              onClick={() => setShowConsentForm(true)}
            >
              Lägg till samtycke
            </button>
          )}
        </div>
      </aside>
      {showMedicalHistory && (
        <MedicalHistoryModal
          isOpen={showMedicalHistory}
          onClose={() => setShowMedicalHistory(false)}
          medicalHistory={medicalHistory}
          setMedicalHistory={setMedicalHistory}
          onSave={handleSaveMedicalHistory}
        />
      )}

      {showConsentForm && (
        <ConsentFormModal
          isOpen={showConsentForm}
          onClose={() => setShowConsentForm(false)}
          consentForm={consentForm}
          setConsentForm={setConsentForm}
          setConsentFormCompleted={setConsentFormCompleted}
          sessionDate={sessionDate}
          client={client}
          treatmentSessions={treatmentSessions}
          treatments={treatments}
        />
      )}
    </div>
  );
};

export default EditTreatmentSession;
