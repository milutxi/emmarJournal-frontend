import { useState } from "react";
import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { useNavigate } from "react-router-dom";
import { Client, Journal } from "../types";
import styles from "./oneClient.module.scss";
import SessionDocumentModal from "../components/SessionDocumentModal/sessionDocumentModal";

import { formatDisplayDate, 
  getJournalTreatmentNames,
  hasJournalConsentForm,
  hasJournalMedicalHistory,
 } from "../utils/jounalHelpers";

import { MdOutlineDoneOutline } from "react-icons/md";
import { GrStatusWarning } from "react-icons/gr";
import { HiOutlineEllipsisHorizontalCircle } from "react-icons/hi2";

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

// const formatDate = (date: string) => {
//   const parsed = new Date(date);
//   if (isNaN(parsed.getTime())) return date;

//   return new Intl.DateTimeFormat("en-GB").format(parsed);
// };

// const getTreatmentName = (
//   treatment: Journal["treatments"][number]["treatmentId"],
// ) => {
//   if (typeof treatment === "string") {
//     return "Behandling";
//   }

//   return treatment.tname || "Behandling";
// };

// const getJournalTreatmentNames = (journal: Journal) => {
//   return journal.treatments
//     .map((session) => getTreatmentName(session.treatmentId))
//     .join(", ");
// };

// const getMedicalHistory = (journal: Journal) => {
//   if (typeof journal.medicalHistoryId === "string") {
//     return null;
//   }

//   return journal.medicalHistoryId;
// };

// const getConsentForm = (journal: Journal) => {
//   if (typeof journal.consentFormId === "string") {
//     return null;
//   }

//   return journal.consentFormId;
// };

const OneClient = () => {
  const { client, journals } = useLoaderData() as {
    client: Client;
    journals: Journal[];
  };
  const navigate = useNavigate();

  const [sessionDocumentJournal, setSessionDocumentJournal] =
    useState<Journal | null>(null);

  const [openJournalMenuId, setOpenJournalMenuId] = useState<string | null>(
    null,
  );

  const getStatusIcon = (completed: boolean) => {
    const className = completed ? styles.statusDone : styles.statusWarning;

    return (
      <span className={className}>
        {completed ? <MdOutlineDoneOutline /> : <GrStatusWarning />}
      </span>
    );
  };

  const handleEditJournal = (journal: Journal) => {
    setOpenJournalMenuId(null);
    navigate(`/app/clients/${client._id}/journals/${journal._id}/edit`);
  };

  // NOT NEED TO DELETE ANYTHING RIGHT NOW ----

  // const handleDeleteJournal = (journal: Journal) => {
  //   setOpenJournalMenuId(null);
  //   alert("Ta bort session är inte tillgängligt.");
  // };

  // const handleDeleteJournal = (journal: Journal) => {
  //   setOpenJournalMenuId(null);
  //   steg.");
  // };

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
              <strong>Födelsedag:</strong> {formatDisplayDate(client.dateOfBirth)}
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

        {journals.length === 0 ? (
          <div className={styles.oneClientStyle__emptyState}>
            <p>Inga behandlingssessioner ännu</p>
            <span>
              När en behandling eller konsult sparas visas den här tillsammans
              med eventuell hälsodeklaration och samtycke.
            </span>
          </div>
        ) : (
          <ul className={styles.oneClientStyle__journalList}>
            {journals.map((journal) => {
              const medicalHistory = hasJournalMedicalHistory(journal);
              const consentForm = hasJournalConsentForm(journal);

              return (
                <li
                  key={journal._id}
                  className={styles.oneClientStyle__journalRow}
                >
                  <button
                    type="button"
                    className={styles.oneClientStyle__sessionButton}
                    onClick={() => setSessionDocumentJournal(journal)}
                  >
                    <span className={styles.oneClientStyle__journalDate}>
                      {formatDisplayDate(journal.jDate)}
                    </span>

                    <span
                      className={styles.oneClientStyle__journalTreatmentName}
                    >
                      {getJournalTreatmentNames(journal)}
                    </span>
                  </button>

                  <button
                    type="button"
                    className={styles.oneClientStyle__documentStatusButton}
                    onClick={() => {
                      if (!medicalHistory) {
                        alert(
                          "Ingen hälsodeklaration är kopplad till denna behandlingssession..",
                        );
                        return;
                      }
                      setSessionDocumentJournal(journal);
                    }}
                  >
                    <span className={styles.iconWrapper}>
                      {getStatusIcon(Boolean(medicalHistory))}
                    </span>

                    <span className={styles.buttonText}>
                      Medicinsk Hälsodeklaration
                    </span>
                  </button>

                  <button
                    type="button"
                    className={styles.oneClientStyle__documentStatusButton}
                    onClick={() => {
                      if (!consentForm) {
                        alert(
                          "Inget samtycke är kopplat till denna behandlingssession.",
                        );
                        return;
                      }
                      setSessionDocumentJournal(journal);
                    }}
                  >
                    <span className={styles.iconWrapper}>
                      {getStatusIcon(Boolean(consentForm))}
                    </span>

                    <span className={styles.buttonText}>Samtycke</span>
                  </button>

                  <div className={styles.oneClientStyle__journalMenuWrapper}>
                    <button
                      type="button"
                      className={styles.oneClientStyle__journalMenuButton}
                      aria-label="Öppna sessionsmeny"
                      onClick={() =>
                        setOpenJournalMenuId(
                          openJournalMenuId === journal._id
                            ? null
                            : journal._id,
                        )
                      }
                    >
                      <HiOutlineEllipsisHorizontalCircle />
                    </button>

                    {openJournalMenuId === journal._id && (
                      <div className={styles.oneClientStyle__journalMenu}>
                        <button
                          type="button"
                          onClick={() => handleEditJournal(journal)}
                        >
                          Redigera session
                        </button>

                        {/* <button
                          type="button"
                          className={styles.oneClientStyle__journalMenuDelete}
                          onClick={() => handleDeleteJournal(journal)}
                        >
                          Ta bort session
                        </button> */}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
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
