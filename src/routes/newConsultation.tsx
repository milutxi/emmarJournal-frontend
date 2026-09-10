import { useState } from "react";
import {
  useNavigate,
  Link,
  LoaderFunctionArgs,
  useLoaderData,
} from "react-router-dom";
import styles from "./newConsultation.module.scss";

import { Client } from "../types";

import { getAuthHeaders } from "../utils/authHeaders";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  if (!id) {
    throw new Response("Client id missing", { status: 400 });
  }

  const response = await fetch(
    import.meta.env.VITE_BACKEND_URL + "/clients/" + id,
    {
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...getAuthHeaders(),
      },
    },
  );

  if (!response.ok) {
    throw new Response("Could not get client", {
      status: response.status,
    });
  }

  const client = await response.json();

  return { client };
};

const NewConsultation = () => {
  const { client } = useLoaderData() as { client: Client };

  const navigate = useNavigate();

  const [consultationTitle, setConsultationTitle] = useState("");
  const [consultationText, setConsultationText] = useState("");
  const [consultationDate, setConsultationDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveConsultation = async () => {
    if (!client._id) {
      alert("Kund saknas.");
      return;
    }

    if (
      !consultationDate ||
      !consultationTitle.trim() ||
      !consultationText.trim()
    ) {
      alert("Datum, title och anteckning behövs.");
      return;
    }

    try {
      setIsSaving(true);

      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/consultations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          credentials: "include",
          body: JSON.stringify({
            clientId: client._id,
            consultationTitle,
            consultationText,
            consultationDate,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Could not save consultation");
      }

      const savedConsultation = await response.json();

      console.log("Saved consultation:", savedConsultation);
      alert("Konsultation har sparats.");

      navigate(`/app/clients/${client._id}`);
    } catch (error) {
      console.error("Save consultation error:", error);

      alert("Kunde inte spara konsultationen.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className={styles.newConsultationStyle}>
      {/* <div className={styles.newConsultationStyle__content}> */}
      <div className={styles.newConsultationHeader}>
        <Link
          to={`/app/clients/${client._id}`}
          className={styles.newConsultationHeaderLink}
        >
          <div>
            <h1>Ny Konsultation</h1>

            <h2>
              {client.name} {client.lastName}
            </h2>
          </div>
        </Link>

        <input
          type="date"
          value={consultationDate}
          onChange={(event) => setConsultationDate(event.target.value)}
        />
      </div>

      <div className={styles.consultationCard}>
        <label>
          Title
          <input
            type="text"
            value={consultationTitle}
            onChange={(event) => setConsultationTitle(event.target.value)}
            placeholder="Ex. Första konsultation"
          />
        </label>
        <label>
          Anteckning
          <textarea
            value={consultationText}
            onChange={(event) => setConsultationText(event.target.value)}
            placeholder="Skriv konsultationen här..."
            rows={30}
          />
        </label>

        <div className={styles.consultationActions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => navigate(`/app/clients/${client._id}`)}
          >
            Avbryt
          </button>

          <button
            type="button"
            className={styles.saveButton}
            disabled={isSaving}
            onClick={handleSaveConsultation}
          >
            {isSaving ? "Sparar..." : "Spara"}
          </button>
        </div>
      </div>
      {/* </div> */}
    </main>
  );
};

export default NewConsultation;
