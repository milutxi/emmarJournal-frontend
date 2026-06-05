import styles from "./oneClient.module.scss";

import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { Client, Treatment, Machine } from "../types";
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

  console.log("client:", client);
  console.log("treatments:", treatments);
  console.log("machines:", machines);

  const [selectedTreatment, setSelectedTreatment] = useState("");
  const [selectedMachine, setSelectedMachine] = useState("");
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [duration, setDuration] = useState(0);
  //const [notes, setNotes] = useState("");

  const totalPrice = price - discount;

  const handleTreatmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const treatmentId = e.target.value;

    setSelectedTreatment(treatmentId);

    const treatment = treatments.find((t) => t._id === treatmentId);

    if (treatment) {
      setPrice(treatment.tprice);
      setDuration(treatment.tduration);
    }
  };

  const handleMachineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const machineId = e.target.value;
    setSelectedMachine(machineId);
  };

  return (
    <div className={styles.newTreatmentStyle}>
      <h1>New Treatment Session</h1>
      <p>
        {client.name} {client.lastName}
      </p>
      <p>
        BEHANDLING:
        <select value={selectedTreatment} onChange={handleTreatmentChange}>
          <option value="">Välj behandling</option>
          {treatments.map((treatment) => (
            <option key={treatment._id} value={treatment._id}>
              {treatment.tname}{" "}
            </option>
          ))}
        </select>
        Tid: {duration}min
        <input type="number" value={price} readOnly />
        <input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
        />
        <input type="number" value={totalPrice} readOnly />
        Tid: Duration:
      </p>
      <p> MASKIN </p>
      <select value={selectedMachine} onChange={handleMachineChange}>
        <option value="">Välj Maskin</option>
        {machines.map((machine) => (
          <option key={machine._id} value={machine._id}>
            {machine.mName}{" "}
          </option>
        ))}
      </select>

      <p> NOTES</p>
    </div>
  );
};

export default NewTreatment;
