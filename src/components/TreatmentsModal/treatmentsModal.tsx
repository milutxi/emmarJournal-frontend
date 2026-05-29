import styles from "./treatmentsModal.module.scss";

import { Treatment } from "../../types";
import { useState } from "react";


const Treatmentsmodal = () => {

  const [formData, setFormData] = useState({
  tname: "",
  tdescription: "",
  tduration: 0,
  tprice: 0,
});

const response = await fetch(
  import.meta.env.VITE_BACKEND_URL + "/treatment",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  }
);


  return (

    <div>
<input />
<textarea />
<input type="number" />
<input type="number" />
    </div>
  );
};

export default Treatmentsmodal;