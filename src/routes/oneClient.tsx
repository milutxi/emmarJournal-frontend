import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { useNavigate } from "react-router-dom";
import { Client } from "../types";
import styles from "./oneClient.module.scss";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  const response = await fetch(
    import.meta.env.VITE_BACKEND_URL + "/clients/" + id,
    {
      headers: {
        Accept: "application/json",
      },
    },
  );

  return response.json();
};

const formatDate = (date: string) => {
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("en-GB").format(parsed);
};

const OneClient = () => {
  const client = useLoaderData() as Client;
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
          <h2 className={styles["oneClientStyle__title"]}>Client Journal

          </h2>
        <div  className={styles["oneClientStyle__meny"]}>

          <button className={styles["oneClientStyle__button"]}>+ Ny konsult</button>
          <button 
            className={styles["oneClientStyle__button"]}
            onClick={() => navigate(`/app/clients/${client._id}/treatment/new`)}
            >+ Ny Behandling Session</button>
        </div>
        </div>

        {/* EMPTY STATE (future timeline area) */}
        <div className={styles.oneClientStyle__emptyState}>
          <p>No medical records yet</p>
          <span>Coming soon — appointments, notes, treatments...</span>
        </div>
      </div>
    </div>
  );
};

export default OneClient;
