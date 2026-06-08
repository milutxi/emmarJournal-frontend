import styles from "./oneClient.module.scss";

import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { Client, Treatment, Machine, TreatmentBlock } from "../types";
import { useState } from "react";

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

const NewTreatment = () => {
  const { client, treatments, machines } = useLoaderData() as {
    client: Client;
    treatments: Treatment[];
    machines: Machine[];
  };

  const [treatmentBlocks, setTreatmentBlocks] = useState<TreatmentBlock[]>([
    {
      treatmentId: "",
      machineIds: [],
      price: 0,
      discount: 0,
      notes: "",
    },
  ]);

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

    setTreatmentBlocks(updatedBlocks);
  };

  const handleDiscountChange = (index: number, value: number) => {
    const updatedBlocks = [...treatmentBlocks];

    updatedBlocks[index].discount = value;

    setTreatmentBlocks(updatedBlocks);
  };

  const block = treatmentBlocks[0];

  const duration =
    treatments.find((t) => t._id === block.treatmentId)?.tduration || 0;

  const addTreatmentBlock = () => {
    setTreatmentBlocks([
      ...treatmentBlocks,
      {
        treatmentId: "",
        machineIds: [],
        price: 0,
        discount: 0,
        notes: "",
      },
    ]);

    console.log(treatmentBlocks);
  };

  return (
    <div className={styles.newTreatmentStyle}>
      <h1>New Treatment Session</h1>
      <p>
        {client.name} {client.lastName}
      </p>
      {treatmentBlocks.map((block, index) => (
        <div key={index}>
          <h3>Number of treatments: {index + 1}</h3>
          <p>
            BEHANDLING:
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
          </p>
          <p>Tid: {duration}min</p>
          <p>
            Price:
            <input type="number" value={block.price} readOnly />
            <input
              type="number"
              value={block.discount}
              onChange={(e) =>
                handleDiscountChange(index, Number(e.target.value))
              }
            />
            <input
              type="number"
              value={block.price - block.discount}
              readOnly
            />
          </p>

          <p> MASKIN </p>
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

          <p> NOTES</p>
        </div>
      ))}
      <button onClick={addTreatmentBlock}>+ Add Treatment</button>
      <h3> Session Summary</h3>
      <p>Total: {grandTotal} kr</p>
    </div>
  );
};

export default NewTreatment;
