import { useState } from "react";
import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { useNavigate } from "react-router-dom";
import { Client, Journal } from "../types";
import styles from "./oneClient.module.scss";
import SessionDocumentModal from "../components/SessionDocumentModal/sessionDocumentModal";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  const [clientResponse, journalsResponse] = await Promise.all([
    fetch(import.meta.env.VITE_BACKEND_URL + "/clients/" + id, {
      headers: {
        Accept: "application/json",
      },
    }),

    fetch(import.meta.env.VITE_BACKEND_URL + "/journals/client/" + id, {
      headers: {
        Accept: "application/json",
      },
    }),
  ]);

  const client = await clientResponse.json();
  const journals = await journalsResponse.json();

  return { client, journals };
};

const formatDate = (date: string) => {
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("en-GB").format(parsed);
};

const getTreatmentName = (
  treatment: Journal["treatments"][number]["treatmentId"],
) => {
  if (typeof treatment === "string") {
    return "Behandling";
  }

  return treatment.tname || "Behandling";
};

const getJournalTreatmentNames = (journal: Journal) => {
  return journal.treatments
    .map((session) => getTreatmentName(session.treatmentId))
    .join(", ");
};

const getMedicalHistory = (journal: Journal) => {
  if (typeof journal.medicalHistoryId === "string") {
    return null;
  }

  return journal.medicalHistoryId;
};

const getConsentForm = (journal: Journal) => {
  if (typeof journal.consentFormId === "string") {
    return null;
  }

  return journal.consentFormId;
};

const OneClient = () => {
  const { client, journals } = useLoaderData() as {
    client: Client;
    journals: Journal[];
  };
  const navigate = useNavigate();

  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);

const [selectedMedicalHistory, setSelectedMedicalHistory] = useState<
  Exclude<Journal["medicalHistoryId"], string> | null
>(null);

const [selectedConsentForm, setSelectedConsentForm] = useState<
  Exclude<Journal["consentFormId"], string> | null
>(null);

const [sessionDocumentJournal, setSessionDocumentJournal] =
  useState<Journal | null>(null);

  return (
    <div className={styles.oneClientStyle}>
      {/* LEFT SIDE */}
      <div className={styles.oneClientStyle__left}>
        <div className={styles.oneClientStyle__card}>
          <div className={styles.oneClientStyle__avatarWrapper}>
            <div className={styles.oneClientStyle__avatar}>
              {client.name?.[0]?.toUpperCase()}
              {client.lastName?.[0]?.toUpperCase()}
            </div>
          </div>

          <h2 className={styles.oneClientStyle__name}>
            {client.name} {client.lastName}
          </h2>

          <div className={styles.oneClientStyle__info}>
            <p>
              <strong>Telefon:</strong> {client.telephone}
            </p>
            <p>
              <strong>E-mail:</strong> {client.email}
            </p>
            <p>
              <strong>Födelsedag:</strong> {formatDate(client.dateOfBirth)}
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className={styles.oneClientStyle__right}>
        <div className={styles.oneClientStyle__header}>
          <h2 className={styles["oneClientStyle__title"]}>Client Journal</h2>
          <div className={styles["oneClientStyle__meny"]}>
            <button className={styles["oneClientStyle__button"]}>
              + Ny konsult
            </button>
            <button
              className={styles["oneClientStyle__button"]}
              onClick={() =>
                navigate(`/app/clients/${client._id}/treatment/new`)
              }
            >
              + Ny Behandling Session
            </button>
          </div>
        </div>

        {/* EMPTY STATE (future timeline area) */}
        {/* <div className={styles.oneClientStyle__emptyState}>
          <p>No medical records yet</p>
          <span>Coming soon — appointments, notes, treatments...</span>
        </div> */}

        {journals.length === 0 ? (
  <div className={styles.oneClientStyle__emptyState}>
    <p>No medical records yet</p>
    <span>Coming soon — appointments, notes, treatments...</span>
  </div>
) : (
   <ul className={styles.oneClientStyle__journalList}>
    {journals.map((journal) => (
      <li key={journal._id} className={styles.oneClientStyle__journalRow}>
        <button
          type="button"
          className={styles.oneClientStyle__sessionButton}
          onClick={() => setSessionDocumentJournal(journal)
          //   {
          //   setSelectedJournal(journal);
          //   setSelectedMedicalHistory(null);
          //   setSelectedConsentForm(null);
          // }
          }
        >
          <span className={styles.oneClientStyle__journalDate}>
            {formatDate(journal.jDate)}
          </span>

          <span className={styles.oneClientStyle__journalTreatmentName}>
            {getJournalTreatmentNames(journal)}
          </span>
        </button>

        <button
          type="button"
          className={styles.oneClientStyle__documentButton}
          onClick={() => {
            const medicalHistory = getMedicalHistory(journal);

            if (!medicalHistory) {
              alert("Hälsodeklarationen kunde inte visas.");
              return;
            }

            setSelectedMedicalHistory(medicalHistory);
            setSelectedJournal(null);
            setSelectedConsentForm(null);
          }}
        >
          Hälsodeklaration
        </button>

        <button
          type="button"
          className={styles.oneClientStyle__documentButton}
          onClick={() => {
            const consentForm = getConsentForm(journal);

            if (!consentForm) {
              alert("Samtycket kunde inte visas.");
              return;
            }

            setSelectedConsentForm(consentForm);
            setSelectedJournal(null);
            setSelectedMedicalHistory(null);
          }}
        >
          Samtycke
        </button>
      </li>
    ))}
  </ul>
  
)}
{selectedJournal && (
  <div className={styles.oneClientStyle__viewer}>
    <h3>Behandling {formatDate(selectedJournal.jDate)}</h3>

    {selectedJournal.treatments.map((session, index) => (
      <div key={`${selectedJournal._id}-${index}`}>
        <p>
          <strong>{getTreatmentName(session.treatmentId)}</strong>
        </p>
        <p>Tid: {session.duration} min</p>
        <p>Pris: {session.price} kr</p>
        <p>Rabatt: {session.discount ?? 0} kr</p>
        <p>Total: {session.totalPrice} kr</p>
        {session.notes && <p>Anteckning: {session.notes}</p>}
      </div>
    ))}
  </div>
)}

{selectedMedicalHistory && (
  <div className={styles.oneClientStyle__viewer}>
    <h3>Hälsodeklaration</h3>

    {"version" in selectedMedicalHistory && selectedMedicalHistory.version && (
      <p>Version {selectedMedicalHistory.version}</p>
    )}

    {selectedMedicalHistory.signedAt && (
      <p>Signerad {formatDate(selectedMedicalHistory.signedAt)}</p>
    )}

    {selectedMedicalHistory.allergies && (
      <p>Allergier: {selectedMedicalHistory.allergyDetails || "Ja"}</p>
    )}

    {selectedMedicalHistory.medication && (
      <p>Medicinering: {selectedMedicalHistory.medicationDetails || "Ja"}</p>
    )}

    {selectedMedicalHistory.otherConditions && (
      <p>Övrigt: {selectedMedicalHistory.otherConditions}</p>
    )}

    {selectedMedicalHistory.mhnotes && (
      <p>Anteckningar: {selectedMedicalHistory.mhnotes}</p>
    )}
  </div>
)}

{selectedConsentForm && (
  <div className={styles.oneClientStyle__viewer}>
    <h3>Samtycke</h3>

    {selectedConsentForm.signedAt && (
      <p>Signerat {formatDate(selectedConsentForm.signedAt)}</p>
    )}

    <p>{selectedConsentForm.consentText}</p>

    {selectedConsentForm.signatureImage && (
      <img
        className={styles.oneClientStyle__signatureImage}
        src={selectedConsentForm.signatureImage}
        alt="Kundens underskrift"
      />
    )}
  </div>
)}


      </div>
      <SessionDocumentModal
  isOpen={!!sessionDocumentJournal}
  onClose={() => setSessionDocumentJournal(null)}
  journal={sessionDocumentJournal}
  clientName={`${client.name} ${client.lastName}`}
/>
    </div>
  );
};

export default OneClient;
