import Treatmentsmodal from "../components/TreatmentsModal/treatmentsModal";
import { Treatment } from "../types";

//import styles from "./treatments.module.scss";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const deleteTreatment = async (id: string) => {
  const confirmed = window.confirm("Ta bort behandlingen?");

  if (!confirmed) return;

  const response = await fetch(
    import.meta.env.VITE_BACKEND_URL + "/treatment/" + id,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete treatment");
  }

  // remove from UI without reload
  setTreatments((prev) => prev.filter((treatment) => treatment._id !== id));
};

const Treatments = () => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [showModal, setShowModal] = useState(false);

  const loadTreatments = () => {
    fetch(import.meta.env.VITE_BACKEND_URL + "/treatment")
      .then((res) => res.json())
      .then((data) => setTreatments(data));
  };
  useEffect(() => {
    loadTreatments();
  }, []);

  return (
    <div>
      <h1>BEHANDLINGAR</h1>
      <button onClick={() => setShowModal(true)}>Ny behandling</button>

      {treatments.map((treatment) => (
        <div key={treatment._id}>
          <Link to={`/app/treatments/${treatment._id}`}>{treatment.tname}</Link>

          <button onClick={() => deleteTreatment(treatment._id)}>
            Ta bort
          </button>
        </div>
      ))}

      {showModal && (
        <Treatmentsmodal
          onClose={() => setShowModal(false)}
          onCreated={loadTreatments}
        />
      )}
    </div>
  );
};

export default Treatments;
