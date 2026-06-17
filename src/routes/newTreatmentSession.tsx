import styles from "./newTreatmentSession.module.scss";
import { useEffect } from "react";

import { LoaderFunctionArgs, useLoaderData } from "react-router";
import {
  Client,
  Treatment,
  Machine,
  TreatmentBlock,
  TreatmentParametersType,
} from "../types";
import { useState } from "react";
import TreatmentParameters from "../components/TreatmentParameters/treatmentParameters";

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

  const [treatmentBlocks, setTreatmentBlocks] = useState<TreatmentBlock[]>([
    {
      treatmentId: "",
      machineIds: [],
      duration: 0,
      price: 0,
      discount: 0,
      notes: "",

      treatmentParameters: {},
    },
  ]);
  const [sessionDate, setSessionDAte] = useState(
    new Date().toISOString().split("T")[0],
  );

  const grandTotal = treatmentBlocks.reduce(
    (sum, block) => sum + (block.price - block.discount),
    0,
  );

  const handleTreatmentChange = (index: number, treatmentId: string) => {
    const updatedBlocks = [...treatmentBlocks];

    const treatment = treatments.find((t) => t._id === treatmentId);

    updatedBlocks[index].treatmentId = treatmentId;

    if (treatment) {
      updatedBlocks[index].price = treatment.tprice;
      updatedBlocks[index].duration = treatment.tduration;
    }

    setTreatmentBlocks(updatedBlocks);
  };

  const handleMachineChange = (
    index: number,
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const machineIds = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    const updatedBlocks = [...treatmentBlocks];

    updatedBlocks[index].machineIds = machineIds;

    const selectedMachines = machines.filter((machine) =>
      machineIds.includes(machine._id),
    );

    const requiresParameters = selectedMachines.some(
      (machine) => machine.requiresTreatmentParameters,
    );

    if (requiresParameters && !updatedBlocks[index].treatmentParameters) {
      updatedBlocks[index].treatmentParameters = {};
    }

    if (!requiresParameters) {
      updatedBlocks[index].treatmentParameters = undefined;
    }

    setTreatmentBlocks(updatedBlocks);
  };

  const handleDiscountChange = (index: number, value: number) => {
    const updatedBlocks = [...treatmentBlocks];

    updatedBlocks[index].discount = value;

    setTreatmentBlocks(updatedBlocks);
  };

  const totalDuration = treatmentBlocks.reduce(
    (sum, block) => sum + block.duration,
    0,
  );

  const handleParameters = (index: number, params: TreatmentParametersType) => {
    const updatedBlocks = [...treatmentBlocks];

    updatedBlocks[index].treatmentParameters = params;

    setTreatmentBlocks(updatedBlocks);
  };

  const addTreatmentBlock = () => {
    setTreatmentBlocks([
      ...treatmentBlocks,
      {
        treatmentId: "",
        machineIds: [],
        duration: 0,
        price: 0,
        discount: 0,
        notes: "",

        treatmentParameters: {},
      },
    ]);

    console.log(treatmentBlocks);
  };

  const removeTreatmentBlock = (index: number) => {
    if (treatmentBlocks.length === 1) return;

    setTreatmentBlocks(treatmentBlocks.filter((_, i) => i !== index));
  };

  const handleNotesChange = (index: number, value: string) => {
    const updatedBlocks = [...treatmentBlocks];
    updatedBlocks[index].notes = value;

    setTreatmentBlocks(updatedBlocks);
  };

  const treatmentCount = treatmentBlocks.length;

  const totalDiscount = treatmentBlocks.reduce(
    (sum, block) => sum + block.discount,
    0,
  );

  const subtotal = treatmentBlocks.reduce((sum, block) => sum + block.price, 0);

  useEffect(() => {
    console.log(treatmentBlocks);
  }, [treatmentBlocks]);

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
        {treatmentBlocks.map((block, index) => (
          <div key={index} className={styles.treatmentCard}>
            <div className={styles.treatmentCard__header}>
              <h3>Behandling: {index + 1}</h3>
              {treatmentBlocks.length > 1 && (
                <button
                  className={styles.removeButton}
                  type="button"
                  onClick={() => removeTreatmentBlock(index)}
                >
                  Ta bort Behandling
                </button>
              )}
            </div>
            <div>
              <select
                value={block.treatmentId}
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

            <p>Tid: {block.duration}min</p>
            <div className={styles.priceSection}>
              <div>
                <label>Price:</label>
                <input type="number" value={block.price} readOnly />
              </div>
              <div>
                <label>Discount:</label>
                <input
                  type="number"
                  value={block.discount}
                  onChange={(e) =>
                    handleDiscountChange(index, Number(e.target.value))
                  }
                />
              </div>
              <div>
                <label>Total:</label>
                <input
                  type="number"
                  value={block.price - block.discount}
                  readOnly
                />
              </div>
            </div>
            <div>
              <label> MASKIN </label>
              <select
                multiple
                value={block.machineIds}
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
            {block.treatmentParameters && (
              <TreatmentParameters
                value={block}
                machines={machines}
                onUpdate={(params) => handleParameters(index, params)}
              />
            )}
            <div>
              <label>Behandlingsanteckningar:</label>
              <textarea
                value={block.notes}
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
          onClick={addTreatmentBlock}
        >
          + Add Behandling
        </button>

        <button
          className={styles.saveButton}
          type="button"
          // onClick={saveSession}
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
            {treatmentBlocks.map((block, index) => {
              const treatment = treatments.find(
                (t) => t._id === block.treatmentId,
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
      </div>
    </div>
  );
};

export default NewTreatmentSession;
