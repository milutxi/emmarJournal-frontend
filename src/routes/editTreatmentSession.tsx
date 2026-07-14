import { useState } from "react";
import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { Client, Journal, Machine, Treatment, TreatmentSession } from "../types";

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

  const journal = journals.find((journal: Journal) => journal._id === journalId);

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

  const { _id, createdAt, updatedAt, __v, ...editableParameters } = parameters;

  return editableParameters;
};

const EditTreatmentSession = () => {
  const { client, treatments, machines, journal, latestMedicalHistory } = useLoaderData() as {
    client: Client;
    treatments: Treatment[];
    machines: Machine[];
    journal: Journal;
    latestMedicalHistory: unknown;
  };

const [treatmentSessions, setTreatmentSessions] = useState<TreatmentSession[]>(
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


  return (
    <div>
      <h1>Redigera session</h1>
      <p>
        {client.name} {client.lastName}
      </p>
   <pre>{JSON.stringify(treatmentSessions, null, 2)}</pre>
    </div>
  );
};

export default EditTreatmentSession;