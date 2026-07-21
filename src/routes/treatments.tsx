import TreatmentCard from "../components/TreatmentCard/treatmentCard";
import Treatmentsmodal from "../components/TreatmentsModal/treatmentsModal";
import { Treatment } from "../types";

import styles from "./treatments.module.scss";

import { useEffect, useState } from "react";
//import { Link } from "react-router-dom";

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

  // const deleteTreatment = async (id: string, name: string) => {
  //   const confirmed = window.confirm(
  //     `Är du säker på att du vill ta bort den här behandlingen: ${name}?`,
  //   );

  //   if (!confirmed) return;

  //   const response = await fetch(
  //     import.meta.env.VITE_BACKEND_URL + "/treatment/" + id,
  //     {
  //       method: "DELETE",
  //     },
  //   );

  //   if (!response.ok) {
  //     throw new Error("Failed to delete treatment");
  //   }

  //   // remove from UI without reload
  //   setTreatments((prev) => prev.filter((treatment) => treatment._id !== id));
  // };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>BEHANDLINGAR</h1>
        <button className={styles.newButton} onClick={() => setShowModal(true)}>+ Ny behandling</button>
      </div>
      <div className={styles.grid}>
        {treatments.map((treatment) => (
          <div>
            {/* <Link to={`/app/treatments/${treatment._id}`}>{treatment.tname}</Link> */}

            <TreatmentCard key={treatment._id} treatment={treatment} 
            //onDelete={deleteTreatment}
            />

          </div>
        ))}

        {showModal && (
          <Treatmentsmodal
            onClose={() => setShowModal(false)}
            onCreated={loadTreatments}
          />
        )}
      </div>
    </div>
  );
};

export default Treatments;
