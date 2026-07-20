import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import { Journal as JournalType } from "../types";
import {
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

  const [clientSearch, setClientSearch] = useState("");
  const [treatmentSearch, setTreatmentSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [selectedJournal, setSelectedJournal] = useState<JournalType | null>(
    null,
  );

  const filteredJournals = journals.filter((journal) => {
    const clientSearchValue = clientSearch.toLowerCase().trim();
    const treatmentSearchValue = treatmentSearch.toLowerCase().trim();

    const clientName = getJournalClientName(journal).toLowerCase();
    const treatmentNames = getJournalTreatmentNames(journal).toLowerCase();
    const journalDate = journal.jDate ? journal.jDate.slice(0, 10) : "";

    const matchesClient =
      !clientSearchValue || clientName.includes(clientSearchValue);

    const matchesTreatment =
      !treatmentSearchValue || treatmentNames.includes(treatmentSearchValue);

    const matchesDate = !dateFilter || journalDate === dateFilter;

    return matchesClient && matchesTreatment && matchesDate;
  });

  const hasActiveFilters = Boolean(
    dateFilter || clientSearch || treatmentSearch,
  );

  const clearFilters = () => {
    setDateFilter("");
    setClientSearch("");
    setTreatmentSearch("");
  };

  return (
    <div className={styles.journalPage}>
      <header className={styles.journalHeader}>
        <div>
          <h1>Journal</h1>
          <p>Alla behandlingssessioner</p>
        </div>
      </header>

      <div className={styles.filterRow}>
        <div className={styles.filterInputs}>
          <input
            type="date"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            className={styles.searchInput}
          />

          <input
            type="search"
            placeholder="Sök kund"
            value={clientSearch}
            onChange={(event) => setClientSearch(event.target.value)}
            className={styles.searchInput}
          />

          <input
            type="search"
            placeholder="Sök behandling"
            value={treatmentSearch}
            onChange={(event) => setTreatmentSearch(event.target.value)}
            className={styles.searchInput}
          />
        </div>

        <span className={styles.filterStatusLabel}>Hälsodeklaration</span>
        <span className={styles.filterStatusLabel}>Samtycke</span>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className={styles.clearFiltersButton}
        >
          Rensa filter
        </button>
      )}

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
