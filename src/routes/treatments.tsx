import { Treatment } from "../types";

import styles from "./treatments.module.scss";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Treatments = () => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);

  useEffect(() => {
    fetch(import.meta.env.VITE_BACKEND_URL + "/treatment")
      .then((res) => res.json())
      .then((data) => setTreatments(data));
  }, []);

  return (
    <div>
      <h1>BEHANDLINGAR</h1>
      <p>Page under construction</p>

      {treatments.map((treatment) => (
        <div key={treatment._id}>
          <Link key={treatment._id} to={`/app/treatments/${treatment._id}`}>
            {treatment.tname}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Treatments;
