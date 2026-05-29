import styles from "./treatmentsModal.module.scss";

import { useState } from "react";

type Props = {
  onClose: () => void;
  onCreated: () => void;
};
const Treatmentsmodal = ({ onClose, onCreated }: Props) => {
  const [formData, setFormData] = useState({
    tname: "",
    tdescription: "",
    tduration: "",
    tprice: "",
  });

  const handleSubmit = async () => {
    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/treatment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,

          tduration: Number(formData.tduration),
          tprice: Number(formData.tprice),
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to create treatment");
    }
    onCreated();
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        <h2 className={styles.title}>Ny behandling</h2>

        <div className={styles.form}>
          <input
            className={styles.input}
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
            className={styles.textarea}
            placeholder="Kommentär"
            value={formData.tdescription}
            onChange={(e) =>
              setFormData({
                ...formData,
                tdescription: e.target.value,
              })
            }
          />

          <div className={styles.inlineFields}>
            <div className={styles.field}>
              <label>Tid (min)</label>
              <input
                className={styles.input}
                type="number"
                min="0"
                step="1"
                value={formData.tduration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tduration: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.field}>
              <label>Pris (kr)</label>
              <input
                className={styles.input}
                type="number"
                min="0"
                step="0.01"
                value={formData.tprice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tprice: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <button className={styles.createBtn} onClick={handleSubmit}>
            Skapa behandling
          </button>
        </div>
      </div>
    </div>
  );
};

export default Treatmentsmodal;
