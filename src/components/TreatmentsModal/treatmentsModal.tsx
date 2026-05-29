//import styles from "./treatmentsModal.module.scss";

import { useState } from "react";

type Props = {
  onClose: () => void;
  onCreated: () => void;
};
const Treatmentsmodal = ({ onClose, onCreated }: Props) => {
  const [formData, setFormData] = useState({
    tname: "",
    tdescription: "",
    tduration: 0,
    tprice: 0,
  });

  const handleSubmit = async () => {
    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/treatment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to create treatment");
    }
    onCreated();
    onClose();
  };

  return (
    <div>
      <input
        placeholder="Behandling"
        value={formData.tname}
        onChange={(e) =>
          setFormData({
            ...formData,
            tname: e.target.value,
          })
        }
      />
      <textarea
      placeholder="Kommentär"
        value={formData.tdescription}
        onChange={(e) =>
          setFormData({
            ...formData,
            tdescription: e.target.value,
          })
        }
      />
      <input
        type="number"
        placeholder="Tid (min)"
        value={formData.tduration}
        onChange={(e) =>
          setFormData({
            ...formData,
            tduration: Number(e.target.value),
          })
        }
      />
      <input
        type="number"
        placeholder="Pris"
        value={formData.tprice}
        onChange={(e) =>
          setFormData({
            ...formData,
            tprice: Number(e.target.value),
          })
        }
      />

      <button onClick={handleSubmit}>Skapa behandling</button>
    </div>
  );
};

export default Treatmentsmodal;
