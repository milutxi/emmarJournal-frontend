import styles from "./newTreatmentSession.module.scss";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import { LoaderFunctionArgs, useLoaderData } from "react-router";
import {
  Client,
  Treatment,
  Machine,
  TreatmentSession,
  MedicalHistoryType,
  ConsentFormType,
} from "../types";

import MedicalHistoryModal from "../components/MedicalHistoryModal/medicalHistoryModal";
import { GrStatusWarning } from "react-icons/gr";
import { MdOutlineDoneOutline } from "react-icons/md";
import ConsentFormModal from "../components/ConsentFormModal/consentFormModal";
import { emptyMedicalHistory } from "../defaults/emptyMedicalHistory";

import { useNavigate } from "react-router-dom";

import TreatmenSessionMachineSettings from "../components/TreatmentSessionMachineSettings/treatmentSessionMachineSettings";

import {
  applyDiscount,
  applyTotalPrice,
  applyTreatmenSelection,
} from "../utils/priceHelpers";

type NewTreatmentSessionDraft = {
  sessionDate: string;
  treatmentSessions: TreatmentSession[];
  savedAt: string;
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  const [
    clientResponse,
    treatmentsResponse,
    machinesResponse,
    medicalHistoryResponse,
  ] = await Promise.all([
    fetch(import.meta.env.VITE_BACKEND_URL + "/clients/" + id, {
      credentials: "include",
    }),
    fetch(import.meta.env.VITE_BACKEND_URL + "/treatment/", {
      credentials: "include",
    }),
    fetch(import.meta.env.VITE_BACKEND_URL + "/machine/", {
      credentials: "include",
    }),
    fetch(import.meta.env.VITE_BACKEND_URL + "/medicalHistory/latest/" + id, {
      credentials: "include",
    }),
  ]);

  const client = await clientResponse.json();
  const treatments = await treatmentsResponse.json();
  const machines = await machinesResponse.json();
  const latestMedicalHistory = await medicalHistoryResponse.json();

  return {
    client,
    treatments,
    machines,
    latestMedicalHistory,
  };
};

const NewTreatmentSession = () => {
  const { client, treatments, machines, latestMedicalHistory } =
    useLoaderData() as {
      client: Client;
      treatments: Treatment[];
      machines: Machine[];
      latestMedicalHistory: MedicalHistoryType | null;
    };

  const draftKey = `newTreatmentSessionDraft:${client._id}`;

  const [treatmentSessions, setTreatmentSessions] = useState<
    TreatmentSession[]
  >([
    {
      treatmentId: "",
      machineIds: [],
      machineSettings: [],
      duration: 0,
      price: 0,
      discount: 0,
      notes: "",
      totalPrice: 0,
      treatmentParameters: {},
    },
  ]);
  const [sessionDate, setSessionDAte] = useState(
    new Date().toISOString().split("T")[0],
  );

  const grandTotal = treatmentSessions.reduce(
    (sum, session) => sum + session.totalPrice,
    0,
  );

  const [showMedicalHistory, setShowMedicalHistory] = useState(false);

  // when the state lives in the parent the modal gets localStorage.
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

  //const medicalHistoryCompleted = Object.keys(medicalHistory).length > 1;
  const [medicalHistoryCompleted, setMedicalHistoryCompleted] = useState(false);

  //const consentFormCompleted = false;
  const [consentForm, setConsentForm] = useState<ConsentFormType>({
    treatmentIds: [],
    consentText: "",
    accepted: false,
    signatureImage: "",
  });

  const [showConsentForm, setShowConsentForm] = useState(false);
  const [consentFormCompleted, setConsentFormCompleted] = useState(false);

  const navigate = useNavigate();
  const [isSavingSession, setIsSavingSession] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);

  const [savedMedicalHistoryId, setSavedMedicalHistoryId] = useState<
    string | null
  >(null);

  const [draftReady, setDraftReady] = useState(false);
  const hasCheckedDraft = useRef(false);
  const initialSessionDateRef = useRef(sessionDate);

  const hasTreatmentSessionContent = (sessions: TreatmentSession[]) => {
    return sessions.some((session) => {
      const hasTreatment = Boolean(session.treatmentId);
      const hasMachines = session.machineIds.length > 0;
      const hasNotes = session.notes.trim().length > 0;
      const hasDiscount = session.discount > 0;

      const hasParameters =
        session.treatmentParameters &&
        Object.values(session.treatmentParameters).some((value) => {
          if (typeof value === "boolean") return value === true;
          if (typeof value === "string") return value.trim().length > 0;
          return Boolean(value);
        });

      return (
        hasTreatment ||
        hasMachines ||
        hasNotes ||
        hasDiscount ||
        Boolean(hasParameters)
      );
    });
  };

  useEffect(() => {
    if (hasCheckedDraft.current) return;

    hasCheckedDraft.current = true;
    const savedDraft = localStorage.getItem(draftKey);

    if (!savedDraft) {
      setDraftReady(true);
      return;
    }
    const shouldRestore = window.confirm(
      "Det finns ett sparat utkast för denna behandlingssession. Vill du fortsätta där du slutade?",
    );

    if (!shouldRestore) {
      localStorage.removeItem(draftKey);
      setDraftReady(true);
      return;
    }

    try {
      const parsedDraft = JSON.parse(savedDraft) as NewTreatmentSessionDraft;

      setSessionDAte(parsedDraft.sessionDate);
      setTreatmentSessions(parsedDraft.treatmentSessions);
    } catch (error) {
      console.error("Could not restore treatment session draft:", error);
      localStorage.removeItem(draftKey);
    }

    setDraftReady(true);
  }, [draftKey]);

  useEffect(() => {
    if (!draftReady) return;

    const hasChangedDate = sessionDate !== initialSessionDateRef.current;
    const hasContent =
      hasChangedDate || hasTreatmentSessionContent(treatmentSessions);

    if (!hasContent) {
      localStorage.removeItem(draftKey);
      return;
    }

    const draft: NewTreatmentSessionDraft = {
      sessionDate,
      treatmentSessions,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(draftKey, JSON.stringify(draft));
  }, [draftKey, draftReady, sessionDate, treatmentSessions]);

  const getStatusIcon = (completed: boolean) => {
    const className = completed ? styles.statusDone : styles.statusWarning;
    return (
      <span className={className}>
        {completed ? <MdOutlineDoneOutline /> : <GrStatusWarning />}
      </span>
    );
  };

  // const handleTreatmentChange = (index: number, treatmentId: string) => {
  //   const updatedSessions = [...treatmentSessions];

  //   const treatment = treatments.find((t) => t._id === treatmentId);

  //   updatedSessions[index].treatmentId = treatmentId;

  //   if (treatment) {
  //     updatedSessions[index].price = treatment.tprice;
  //     updatedSessions[index].duration = treatment.tduration;
  //     updatedSessions[index].totalPrice =
  //       treatment.tprice - updatedSessions[index].discount;
  //   }

  //   setTreatmentSessions(updatedSessions);
  // };

  const handleTreatmentChange = (index: number, treatmentId: string) => {
    const treatment = treatments.find((t) => t._id === treatmentId);

    const price = treatment ? treatment.tprice : 0;
    const duration = treatment ? treatment.tduration : 0;

    setTreatmentSessions((currentSessions) =>
      currentSessions.map((session, sessionIndex) =>
        sessionIndex === index
          ? applyTreatmenSelection(session, treatmentId, price, duration)
          : session,
      ),
    );
  };

  // const handleDiscountChange = (index: number, value: number) => {
  //   const updatedSessions = [...treatmentSessions];

  //   updatedSessions[index].discount = value;
  //   updatedSessions[index].totalPrice = updatedSessions[index].price - value;

  //   setTreatmentSessions(updatedSessions);
  // };

  const handleDiscountChange = (index: number, value: number) => {
    setTreatmentSessions((currentSessions) =>
      currentSessions.map((session, sessionIndex) =>
        sessionIndex === index ? applyDiscount(session, value) : session,
      ),
    );
  };

  const handleTotalPriceChange = (index: number, value: number) => {
    setTreatmentSessions((currentSessions) =>
      currentSessions.map((session, sessionIndex) => 
      sessionIndex === index ? applyTotalPrice(session, value) : session,
      ),
    );
  };

  const totalDuration = treatmentSessions.reduce(
    (sum, session) => sum + session.duration,
    0,
  );

  const addTreatmentSession = () => {
    setTreatmentSessions([
      ...treatmentSessions,
      {
        treatmentId: "",
        machineIds: [],
        machineSettings: [],
        duration: 0,
        price: 0,
        discount: 0,
        notes: "",
        totalPrice: 0,
        treatmentParameters: {},
      },
    ]);
  };

  const removeTreatmentSession = (index: number) => {
    if (treatmentSessions.length === 1) return;

    setTreatmentSessions(treatmentSessions.filter((_, i) => i !== index));
  };

  const handleNotesChange = (index: number, value: string) => {
    const updatedSessions = [...treatmentSessions];
    updatedSessions[index].notes = value;

    setTreatmentSessions(updatedSessions);
  };

  const handleMachineSettingsChange = (
    index: number,
    machineSettings: TreatmentSession["machineSettings"],
  ) => {
    setTreatmentSessions((currentSessions) =>
      currentSessions.map((session, sessionIndex) => {
        if (sessionIndex !== index) return session;

        return {
          ...session,
          machineSettings,
          machineIds:
            machineSettings?.map((setting) =>
              typeof setting.machineId === "string"
                ? setting.machineId
                : setting.machineId._id,
            ) ?? [],
        };
      }),
    );
  };

  const handleSaveSession = async () => {
    if (sessionSaved) {
      alert("Behandlingssessionen är redan sparad.");
      return;
    }

    const hasMissingTreatment = treatmentSessions.some(
      (session) => !session.treatmentId,
    );

    if (hasMissingTreatment) {
      alert("Du måste välja behandling innan du sparar sessionen");
      return;
    }

    const hasEmptyMachineBlock = treatmentSessions.some((session) =>
      (session.machineSettings ?? []).some((setting) => {
        const machineId =
          typeof setting.machineId === "string"
            ? setting.machineId
            : setting.machineId._id;

        return !machineId;
      }),
    );

    if (hasEmptyMachineBlock) {
      alert(
        "Du har lagt till en maskinrad utan att välja maskin. Välj en maskin eller ta bort raden. ",
      );
      return;
    }

    const missingDocuments: string[] = [];

    if (!savedMedicalHistoryId) {
      missingDocuments.push("hälsodeklaration");
    }

    if (!consentForm._id) {
      missingDocuments.push("samtycke");
    }

    if (missingDocuments.length > 0) {
      const shouldContinue = window.confirm(
        `Följande saknas: ${missingDocuments.join(
          " och ",
        )}. Vill du ändå spara behandlingssessionen?`,
      );

      if (!shouldContinue) {
        return;
      }
    }

    const journalTreatments = treatmentSessions.map((session) => ({
      treatmentId: session.treatmentId,
      machineSettings: session.machineSettings ?? [],
      duration: session.duration,
      price: session.price,
      discount: session.discount,
      totalPrice: session.totalPrice,
      notes: session.notes,
    }));

    const payload = {
      clientId: client._id,
      jDate: sessionDate,
      treatments: journalTreatments,
      medicalHistoryId: savedMedicalHistoryId || undefined,
      consentFormId: consentForm._id || undefined,
    };

    //     console.log("Journal payload:", payload);
    // console.log(
    //   "Machine settings payload:",
    //   payload.treatments.map((treatment) => treatment.machineSettings),
    // );

    try {
      setIsSavingSession(true);

      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/createJournal/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );

      const savedJournal = await response.json();

      if (!response.ok) {
        console.error("Journal save failed:", savedJournal);
        alert(savedJournal.message || "Kunde inte spara behandlingssessionen.");
        return;
      }

      console.log("Saved journal:", savedJournal);

      setSessionSaved(true);

      localStorage.removeItem(draftKey);
      alert("Behandlingssessionen sparades.");

      navigate(`/app/clients/${client._id}`);
    } catch (error) {
      console.error("Error saving journal:", error);
      alert("Kunde inte spara behandlingssessionen.");
    } finally {
      setIsSavingSession(false);
    }
  };

  const treatmentCount = treatmentSessions.length;

  const totalDiscount = treatmentSessions.reduce(
    (sum, session) => sum + session.discount,
    0,
  );

  const subtotal = treatmentSessions.reduce(
    (sum, session) => sum + session.price,
    0,
  );

  useEffect(() => {
    //console.log(treatmentSessions);
  }, [treatmentSessions]);

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
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );

      const savedMedicalHistory = await response.json();

      if (!response.ok) {
        console.error("Medical history save failed:", savedMedicalHistory);
        alert(
          savedMedicalHistory.message || "Kunde inte spara hälsodeklarationen.",
        );
        return;
      }

      setMedicalHistory(savedMedicalHistory);
      setSavedMedicalHistoryId(savedMedicalHistory._id);
      setMedicalHistoryCompleted(true);
      setShowMedicalHistory(false);
    } catch (error) {
      console.error("Error saving medical history:", error);
      alert("Kunde inte spara hälsodeklarationen.");
    }
  };

  return (
    <div className={styles.newTreatmentStyle}>
      <div className={styles.newTreatmentStyle__left}>
        <div className={styles.sessionHeader}>
          <Link
            to={`/app/clients/${client._id}`}
            className={styles.sessionHeaderLink}
          >
            <div>
              <h1>Ny Behandling Session</h1>
              <h2>
                {client.name} {client.lastName}
              </h2>
            </div>
          </Link>
          <input
            type="date"
            value={sessionDate}
            onChange={(e) => setSessionDAte(e.target.value)}
          />
        </div>

        {treatmentSessions.map((session, index) => (
          <div key={index} className={styles.treatmentCard}>
            <div className={styles.treatmentCard__header}>
              <h2>Behandling: {index + 1}</h2>
              {treatmentSessions.length > 1 && (
                <button
                  className={styles.removeButton}
                  type="button"
                  onClick={() => removeTreatmentSession(index)}
                >
                  Ta bort Behandling
                </button>
              )}
            </div>

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
                    onChange={(e) =>
                      handleTreatmentChange(index, e.target.value)
                    }
                  >
                    <option value="">Välj behandling</option>

                    {treatments.map((treatment) => (
                      <option key={treatment._id} value={treatment._id}>
                        {treatment.tname}
                      </option>
                    ))}
                  </select>
                </label>

                <input type="number" value={session.duration} readOnly />

                <input type="number" value={session.price} readOnly />

                <input
                  type="number"
                  min="0"
                  max={session.price}
                  placeholder="0"
                  value={session.discount === 0 ? "" : session.discount}
                  onChange={(e) =>
                    handleDiscountChange(index, Number(e.target.value))
                  }
                />

                {/* <div className={styles.totalPreview}>
                  {session.totalPrice} kr
                </div> */}

                <input
                  type="number"
                  min="0"
                  max={session.price}
                  placeholder="0"
                  value={session.totalPrice === 0 ? "" : session.totalPrice}
                  onChange={(e) =>
                    handleTotalPriceChange(index, Number(e.target.value))
                  }
                />
              </div>
            </div>

            {/* <div className={styles.formSection}>
              <h4 className={styles.formSectionTitle}>Maskiner</h4>

              <div className={styles.machineGrid}>
                {machines.map((machine) => {
                  const isChecked = session.machineIds.includes(machine._id);

                  return (
                    <label key={machine._id} className={styles.machineOption}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) =>
                          handleMachineCheckboxChange(
                            index,
                            machine._id,
                            e.target.checked,
                          )
                        }
                      />
                      {machine.mName}
                    </label>
                  );
                })}
              </div>
            </div> */}

            <div>
              <TreatmenSessionMachineSettings
                machines={machines}
                machineSettings={session.machineSettings ?? []}
                onChange={(machineSettings) =>
                  handleMachineSettingsChange(index, machineSettings)
                }
              />
            </div>

            {/* {session.treatmentParameters && (
              <TreatmentParameters
                value={session}
                machines={machines}
                onUpdate={(params) => handleParameters(index, params)}
              />
            )} */}
            <div>
              <label>Behandlingsanteckningar:</label>
              <textarea
                value={session.notes}
                onChange={(e) => handleNotesChange(index, e.target.value)}
                rows={4}
                placeholder="Behandling antekningar"
              />
            </div>
          </div>
        ))}
        <button
          className={styles.addButton}
          type="button"
          onClick={addTreatmentSession}
        >
          + Add Behandling
        </button>

        <button
          className={styles.saveButton}
          type="button"
          onClick={handleSaveSession}
          disabled={isSavingSession || sessionSaved}
        >
          {isSavingSession
            ? "Sparar..."
            : sessionSaved
              ? "Sparad"
              : "Spara behandlingssession"}
        </button>
      </div>

      {/* summary on the right side */}

      <div className={styles.newTreatmentStyle__right}>
        <div className={styles.sessionSummary}>
          <h2>Session Summary</h2>

          <p>
            <strong>Client:</strong> {client.name} {client.lastName}
          </p>

          <p>
            <strong>Date:</strong> {sessionDate}
          </p>

          <p>
            <strong>Treatments:</strong> {treatmentCount}
          </p>

          <ul>
            {treatmentSessions.map((session, index) => {
              const treatment = treatments.find(
                (t) => t._id === session.treatmentId,
              );

              return (
                <li key={index}>
                  {treatment?.tname || "No treatment selected"}
                </li>
              );
            })}
          </ul>
          <p>
            <strong>Total behandlingstid:</strong>{" "}
            {Math.floor(totalDuration / 60)}h {totalDuration % 60}min
          </p>

          <p>
            <strong>Subtotal:</strong> {subtotal} kr
          </p>

          <p>
            <strong>Total discount:</strong> {totalDiscount} kr
          </p>

          <p>
            <strong>Total:</strong> {grandTotal} kr
          </p>
        </div>

        {showMedicalHistory && (
          <MedicalHistoryModal
            isOpen={showMedicalHistory}
            onClose={() => setShowMedicalHistory(false)}
            medicalHistory={medicalHistory}
            setMedicalHistory={setMedicalHistory}
            //setMedicalHistoryCompleted={setMedicalHistoryCompleted}
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
        <button
          className={styles.medicalHistoryButton}
          onClick={() => setShowMedicalHistory(true)}
        >
          <span className={styles.iconWrapper}>
            {getStatusIcon(medicalHistoryCompleted)}
          </span>
          <span className={styles.buttonText}>MEDICINSK HÄLSODEKLARATION</span>
        </button>

        <button
          className={styles.medicalHistoryButton}
          onClick={() => setShowConsentForm(true)}
        >
          <span className={styles.iconWrapper}>
            {getStatusIcon(consentFormCompleted)}
          </span>

          <span className={styles.buttonContent}>
            <span className={styles.buttonTitle}>SAMTYCKE</span>

            {consentFormCompleted && (
              <span className={styles.buttonSubtitle}>
                Signerat{" "}
                {new Date(consentForm.signedAt!).toLocaleDateString("sv-SE")}
              </span>
            )}
          </span>
        </button>
      </div>
    </div>
  );
};

export default NewTreatmentSession;
