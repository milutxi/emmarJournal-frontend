import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const NewConsultation = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [consultationTitle, setConsultationTitle] = useState("");
  const [consultationText, setConsultationText] = useState("");
  const [consultationDate, setConsultationDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveConsultation = async () => {
    if (!id) {
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
          },
          credentials: "include",
          body: JSON.stringify({
            clientId: id,
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

      navigate(`/app/clients/${id}`);
    } catch (error) {
      console.error("Save consultation error:", error);

      alert("Kunde inte spara konsultationen.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main>
      <h1>Ny Konsultation</h1>
      <label>
        Datum
        <input 
          type="date"
          value={consultationDate}
          onChange={(event) => setConsultationDate(event.target.value)}
        />
      </label>

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
      <button
        type="button"
        disabled={isSaving}
        onClick={handleSaveConsultation}
      >
        {isSaving ? "Sparar..." : "Spara"}
      </button>
    </main>
  );
};

export default NewConsultation;
