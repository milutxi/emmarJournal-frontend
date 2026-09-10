import { useState } from "react";
import { Link, LoaderFunctionArgs, useLoaderData, useNavigate } from "react-router-dom";
import { Client, Consultation } from "../types";
import styles from "./newConsultation.module.scss";
import { getAuthHeaders } from "../utils/authHeaders";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id, consultationId } = params;

  const [clientResponse, consultationResponse] = await Promise.all([
    fetch(import.meta.env.VITE_BACKEND_URL + "/clients/" + id, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...getAuthHeaders(),
      },
    }),

    fetch(
      import.meta.env.VITE_BACKEND_URL + "/consultations/" + consultationId,
      {
        credentials: "include",
        headers: {
          Accept: "application/json",
          ...getAuthHeaders(),
        },
      },
    ),
  ]);

  const client = await clientResponse.json();
  const consultation = await consultationResponse.json();

  return { client, consultation };
};

const EditConsultation = () => {
  const { client, consultation } = useLoaderData() as {
    client: Client;
    consultation: Consultation;
  };

  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const [consultationDate, setConsultationDate] = useState(
    consultation.consultationDate.slice(0, 10),
  );

  const [consultationTitle, setConsultationTitle] = useState(
    consultation.consultationTitle,
  );

  const [consultationText, setConsultationText] = useState(
    consultation.consultationText,
  );


  const handleSaveEditConsultation = async () => {
    if(!consultation._id) {
      alert("Konsultation saknas.");
      return;
    }

    if (
      !consultationDate ||
      !consultationTitle.trim() ||
      !consultationText.trim()
    ) {
      alert("Datum, titel och anteckning behövs.");
      return;
    }

    try{
      setIsSaving(true);

      const response = await fetch (
        import.meta.env.VITE_BACKEND_URL + "/consultations/" + consultation._id,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          credentials: "include",
          body: JSON.stringify({
            consultationDate,
            consultationTitle,
            consultationText,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Could not update consultation");
      }

      alert("Konsultationen har updaterats.");
      navigate(`/app/clients/${client._id}`);

    }catch (error) {
      console.error("Update consultation error:", error);
      alert("Kunde inte uppdatera konsultationen.");
    }finally {
      setIsSaving(false);
    }
  };

  return (
    <main className={styles.newConsultationStyle}>
      <div className={styles.newConsultationHeader}>
        <Link
          to={`/app/clients/${client._id}`}
          className={styles.newConsultationHeaderLink}
        >
          <div>
            <h1>Redigera Konsultation</h1>

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
            
          />
        </label>
        <label>
          Anteckning
          <textarea
            value={consultationText}
            onChange={(event) => setConsultationText(event.target.value)}
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
            onClick={handleSaveEditConsultation}
          >
            {isSaving ? "Sparar..." : "Spara ändringar"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default EditConsultation;
