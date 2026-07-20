import { useLoaderData } from "react-router-dom";
import { Journal as JournalType } from "../types";
import {
  formatJournalDate,
  getJournalClientName,
  getJournalTreatmentNames,
  hasJournalConsentForm,
  hasJournalMedicalHistory,
} from "../utils/jounalHelpers";

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

const Journal = () => {
  const journals = useLoaderData() as JournalType[];
  return (
    <div>
      <h1>JOURNAL</h1>
      <p>Antal journaler: {journals.length}</p>
      <ul>
        {journals.map((journal) => (
          <li key={journal._id}>
            {formatJournalDate(journal.jDate)} — {getJournalClientName(journal)}{" "}
            — {getJournalTreatmentNames(journal)} —{" "}
            {hasJournalMedicalHistory(journal)
              ? "Hälsodeklaration finns"
              : "Hälsodeklaration saknas"}{" "}
            —{" "}
            {hasJournalConsentForm(journal)
              ? "Samtycke finns"
              : "Samtycke saknas"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Journal;
