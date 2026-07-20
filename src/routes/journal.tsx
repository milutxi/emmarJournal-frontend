import { useLoaderData } from "react-router-dom";
import { Journal as JournalType } from "../types";

export const loader = async () => {
  const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/journals", {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Response("Could not load journals", {
      status: response.status,
    });
  }

  return response.json();
};

const formatDate = (date?: string) => {
  if (!date) return "-";

  const parsed = new Date(date);

  if (isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("sv-Se").format(parsed);
};

const getClientName = (journal: JournalType) => {
  if (typeof journal.clientId === "string") {
    return "kund";
  }

  return `${journal.clientId.name} ${journal.clientId.lastName}`;
};

const getTreatmentName = (
  treatment: JournalType["treatments"][number]["treatmentId"],
) => {
  if (typeof treatment === "string") {
    return "Behandling";
  }

  return treatment.tname || "Behandling";
};

const getJournalTreatmentNames = (journal: JournalType) => {
  return journal.treatments
    .map((session) => getTreatmentName(session.treatmentId))
    .join(", ");
};

const Journal = () => {
  const journals = useLoaderData() as JournalType[];
  return (
    <div>
      <h1>JOURNAL</h1>
      <p>Antal journaler: {journals.length}</p>
      <ul>
        {journals.map((journal) => (
          <li key={journal._id}>
            {formatDate(journal.jDate)} — {getClientName(journal)} —{" "}
            {getJournalTreatmentNames(journal)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Journal;
