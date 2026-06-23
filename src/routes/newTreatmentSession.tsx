import styles from "./newTreatmentSession.module.scss";
import { useEffect } from "react";

import { LoaderFunctionArgs, useLoaderData } from "react-router";
import {
  Client,
  Treatment,
  Machine,
  TreatmentSession,
  TreatmentParametersType,
} from "../types";
import { useState } from "react";
import TreatmentParameters from "../components/TreatmentParameters/treatmentParameters";
import MedicalHistoryModal from "../components/MedicalHistoryModal/medicalHistoryModal";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  const [clientResponse, treatmentsResponse, machinesResponse] =
    await Promise.all([
      fetch(import.meta.env.VITE_BACKEND_URL + "/clients/" + id),
      fetch(import.meta.env.VITE_BACKEND_URL + "/treatment/"),
      fetch(import.meta.env.VITE_BACKEND_URL + "/machine/"),
    ]);

  const client = await clientResponse.json();
  const treatments = await treatmentsResponse.json();
  const machines = await machinesResponse.json();

  return {
    client,
    treatments,
    machines,
  };
};

const NewTreatmentSession = () => {
  const { client, treatments, machines } = useLoaderData() as {
    client: Client;
    treatments: Treatment[];
    machines: Machine[];
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
    const payload = {
      clientId: client._id,
      jDate: sessionDate,
      treatments: treatmentSessions,
    };

    //console.log(payload);

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

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return;
    }

    console.log(data);
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
        <div>
          <button onClick={() => setShowMedicalHistory(true)}>
            Medicinsk Hälsodeklaration
          </button>
        </div>
        {showMedicalHistory && (
          <MedicalHistoryModal
            isOpen={showMedicalHistory}
            onClose={() => setShowMedicalHistory(false)}
          />
        )}
      </div>
    </div>
  );
};

export default NewTreatmentSession;
