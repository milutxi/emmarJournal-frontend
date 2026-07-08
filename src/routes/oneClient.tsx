import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { useNavigate } from "react-router-dom";
import { Client, Journal } from "../types";
import styles from "./oneClient.module.scss";

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

const OneClient = () => {
  const { client, journals } = useLoaderData() as {
    client: Client;
    journals: Journal[];
  };
  const navigate = useNavigate();

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
  <div className={styles.oneClientStyle__journalList}>
    {journals.map((journal) => (
      <article key={journal._id} className={styles.oneClientStyle__journalCard}>
        <div className={styles.oneClientStyle__journalHeader}>
          <h3>Behandlingssession</h3>
          <span>{formatDate(journal.jDate)}</span>
        </div>

        <div className={styles.oneClientStyle__journalTreatments}>
          {journal.treatments.map((session, index) => (
            <div
              key={`${journal._id}-${index}`}
              className={styles.oneClientStyle__journalTreatment}
            >
              <p>
                <strong>{getTreatmentName(session.treatmentId)}</strong>
              </p>

              <p>
                Tid: {session.duration} min · Pris: {session.totalPrice} kr
              </p>

              {session.notes && <p>Anteckning: {session.notes}</p>}
            </div>
          ))}
        </div>
      </article>
    ))}
  </div>
)}



      </div>
    </div>
  );
};

export default OneClient;
