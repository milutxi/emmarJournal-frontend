import styles from "./editTreatmentSession.module.scss";

import { useState } from "react";
import {
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
} from "../types";
import {
  treatmentParameterFields,
  treatmentParameterTextFields,
} from "../config/treatmentParameterFields";
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
  const { client, treatments, machines, journal } = useLoaderData() as {
    client: Client;
    treatments: Treatment[];
    machines: Machine[];
    journal: Journal;
    latestMedicalHistory: unknown;
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
          <div>
            <h1>Redigera Session</h1>
            <h2>
              {client.name} {client.lastName}
            </h2>
          </div>
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
      </aside>
    </div>
  );
};

export default EditTreatmentSession;
