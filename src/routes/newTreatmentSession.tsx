import styles from "./newTreatmentSession.module.scss";
import { useEffect } from "react";

import { LoaderFunctionArgs, useLoaderData } from "react-router";
import {
  Client,
  Treatment,
  Machine,
  TreatmentSession,
  TreatmentParametersType,
  MedicalHistoryType,
  ConsentFormType,
} from "../types";
import { useState } from "react";
import TreatmentParameters from "../components/TreatmentParameters/treatmentParameters";
import MedicalHistoryModal from "../components/MedicalHistoryModal/medicalHistoryModal";
import { GrStatusWarning } from "react-icons/gr";
import { MdOutlineDoneOutline } from "react-icons/md";
import ConsentFormModal from "../components/ConsentFormModal/consentFormModal";
import { emptyMedicalHistory } from "../defaults/emptyMedicalHistory";


export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  const [
    clientResponse,
    treatmentsResponse,
    machinesResponse,
    medicalHistoryResponse,
  ] = await Promise.all([
    fetch(import.meta.env.VITE_BACKEND_URL + "/clients/" + id),
    fetch(import.meta.env.VITE_BACKEND_URL + "/treatment/"),
    fetch(import.meta.env.VITE_BACKEND_URL + "/machine/"),
    fetch(import.meta.env.VITE_BACKEND_URL + "/medicalHistory/latest/" + id),
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

  const [treatmentSessions, setTreatmentSessions] = useState<
    TreatmentSession[]
  >([
    {
      treatmentId: "",
      machineIds: [],
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

  const getStatusIcon = (completed: boolean) => {
    const className = completed ? styles.statusDone : styles.statusWarning;
    return (
      <span className={className}>
        {completed ? <MdOutlineDoneOutline /> : <GrStatusWarning />}
      </span>
    );
  };

  const handleTreatmentChange = (index: number, treatmentId: string) => {
    const updatedSessions = [...treatmentSessions];

    const treatment = treatments.find((t) => t._id === treatmentId);

    updatedSessions[index].treatmentId = treatmentId;

    if (treatment) {
      updatedSessions[index].price = treatment.tprice;
      updatedSessions[index].duration = treatment.tduration;
      updatedSessions[index].totalPrice =
        treatment.tprice - updatedSessions[index].discount;
    }

    setTreatmentSessions(updatedSessions);
  };

  const handleMachineChange = (
    index: number,
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const machineIds = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    const updatedSessions = [...treatmentSessions];

    updatedSessions[index].machineIds = machineIds;

    const selectedMachines = machines.filter((machine) =>
      machineIds.includes(machine._id),
    );

    const requiresParameters = selectedMachines.some(
      (machine) => machine.requiresTreatmentParameters,
    );

    if (requiresParameters && !updatedSessions[index].treatmentParameters) {
      updatedSessions[index].treatmentParameters = {};
    }

    if (!requiresParameters) {
      updatedSessions[index].treatmentParameters = undefined;
    }

    setTreatmentSessions(updatedSessions);
  };

  const handleDiscountChange = (index: number, value: number) => {
    const updatedSessions = [...treatmentSessions];

    updatedSessions[index].discount = value;
    updatedSessions[index].totalPrice = updatedSessions[index].price - value;

    setTreatmentSessions(updatedSessions);
  };

  const totalDuration = treatmentSessions.reduce(
    (sum, session) => sum + session.duration,
    0,
  );

  const handleParameters = (index: number, params: TreatmentParametersType) => {
    const updatedSessions = [...treatmentSessions];

    updatedSessions[index].treatmentParameters = params;

    setTreatmentSessions(updatedSessions);
  };

  const addTreatmentSession = () => {
    setTreatmentSessions([
      ...treatmentSessions,
      {
        treatmentId: "",
        machineIds: [],
        duration: 0,
        price: 0,
        discount: 0,
        notes: "",
        totalPrice: 0,
        treatmentParameters: {},
      },
    ]);

    // console.log(treatmentSessions);
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

  const handleSaveSession = async () => {
    const medicalHistoryId = (
      medicalHistory as MedicalHistoryType & { _id?: string }
    )._id;

    if (!medicalHistoryId) {
      alert("Du måste spara hälsodeklarationen först.");
      return;
    }

    if (!consentForm._id) {
      alert("Du måste spara samtycket först");
      return;
    }

    const journalTreatments = treatmentSessions.map((session) => ({
      treatmentId: session.treatmentId,
      machineIds: session.machineIds,
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
      medicalHistoryId,
      consentFormId: consentForm._id,
    };

    //console.log("Journal payload:", payload);
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/createJournal/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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
      alert("Behandlingssessionen sparades.");

    } catch (error) {
      console.error("Error saving journal:", error);
      alert("Kunde inte spara behandlingssessionen.");
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
          <div>
            <h1>Ny behandling Session</h1>
            <h2>
              {client.name} {client.lastName}
            </h2>
          </div>
        </div>

        <div>
          <label>Behandlingsdatum</label>
          <input
            type="date"
            value={sessionDate}
            onChange={(e) => setSessionDAte(e.target.value)}
          />
        </div>
        {treatmentSessions.map((session, index) => (
          <div key={index} className={styles.treatmentCard}>
            <div className={styles.treatmentCard__header}>
              <h3>Behandling: {index + 1}</h3>
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
            <div>
              <select
                value={session.treatmentId}
                onChange={(e) => handleTreatmentChange(index, e.target.value)}
              >
                <option value="">Välj behandling</option>
                {treatments.map((treatment) => (
                  <option key={treatment._id} value={treatment._id}>
                    {treatment.tname}{" "}
                  </option>
                ))}
              </select>
            </div>

            <p>Tid: {session.duration}min</p>
            <div className={styles.priceSection}>
              <div>
                <label>Price:</label>
                <input type="number" value={session.price} readOnly />
              </div>
              <div>
                <label>Discount:</label>
                <input
                  type="number"
                  value={session.discount}
                  onChange={(e) =>
                    handleDiscountChange(index, Number(e.target.value))
                  }
                />
              </div>
              <div>
                <label>Total:</label>
                <input type="number" value={session.totalPrice} readOnly />
              </div>
            </div>
            <div>
              <label> MASKIN </label>
              <select
                multiple
                value={session.machineIds}
                onChange={(e) => handleMachineChange(index, e)}
              >
                <option value="">Välj Maskin</option>
                {machines.map((machine) => (
                  <option key={machine._id} value={machine._id}>
                    {machine.mName}{" "}
                  </option>
                ))}
              </select>
            </div>
            {session.treatmentParameters && (
              <TreatmentParameters
                value={session}
                machines={machines}
                onUpdate={(params) => handleParameters(index, params)}
              />
            )}
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
        >
          SPARA SESSION
        </button>

        {/* Medicine History */}
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
