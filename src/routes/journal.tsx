import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import { Journal as JournalType } from "../types";
import {
  getJournalClient,
  getJournalClientName,
  getJournalTreatmentNames,
} from "../utils/jounalHelpers";
import SessionDocumentModal from "../components/SessionDocumentModal/sessionDocumentModal";
import JournalSessionRow from "../components/JournalSessionRow/journalSessionRow";
import styles from "./journal.module.scss";
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

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJournal, setSelectedJournal] = useState<JournalType | null>(
    null,
  );

  const filteredJournals = journals.filter((journal) => {
    const searchValue = searchTerm.toLowerCase().trim();

    if (!searchValue) return true;

    const clientName = getJournalClientName(journal).toLowerCase();
    const treatmentNames = getJournalTreatmentNames(journal).toLowerCase();

    return (
      clientName.includes(searchValue) || treatmentNames.includes(searchValue)
    );
  });

  return (
    <div className={styles.journalPage}>
      <header className={styles.journalHeader}>
        <div>
          <h1>Journal</h1>
          <p>Alla behandlingssessioner</p>
        </div>

        <input
          type="search"
          placeholder="Sök kund eller behandling"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className={styles.searchInput}
        />
      </header>

      {filteredJournals.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Inga behandlingssessioner ännu</p>
          <span>När behandlingar sparas visas de här.</span>
        </div>
      ) : (
        <ul className={styles.journalList}>
          {filteredJournals.map((journal) => (
            <JournalSessionRow
              key={journal._id}
              journal={journal}
              showClientName
              onOpen={setSelectedJournal}
            />
          ))}
        </ul>
      )}

      <SessionDocumentModal
        isOpen={!!selectedJournal}
        onClose={() => setSelectedJournal(null)}
        journal={selectedJournal}
        clientName={
          selectedJournal ? getJournalClientName(selectedJournal) : ""
        }
      />
    </div>
  );
};

export default Journal;
