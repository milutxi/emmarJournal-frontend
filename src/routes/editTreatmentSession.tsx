import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { Client, Journal, Machine, Treatment } from "../types";

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

const EditTreatmentSession = () => {
  const { client, journal } = useLoaderData() as {
    client: Client;
    treatments: Treatment[];
    machines: Machine[];
    journal: Journal;
    latestMedicalHistory: unknown;
  };

  return (
    <div>
      <h1>Redigera session</h1>
      <p>
        {client.name} {client.lastName}
      </p>
      <p>{journal._id}</p>
    </div>
  );
};

export default EditTreatmentSession;