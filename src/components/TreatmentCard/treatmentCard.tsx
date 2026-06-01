import styles from "./treatmentCard.module.scss";
import { useState } from "react";
import { Treatment } from "../../types";
import { GrEdit } from "react-icons/gr";
import { RiDeleteBinLine } from "react-icons/ri";

type Props = {
  treatment: Treatment;
  onDelete: (id: string, name: string) => void;
};
const TreatmentCard = ({ treatment, onDelete }: Props) => {
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    tname: treatment.tname,
    tdescription: treatment.tdescription,
    tduration: treatment.tduration,
    tprice: treatment.tprice,
  });

  const updateTreatment = async () => {
    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/treatment/" + treatment._id,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to update treatment");
    }

    const updatedTreatment = await response.json();

    setFormData(updatedTreatment);

    setEditMode(false);
  };

  return (
    <div className={`${styles.card} ${editMode ? styles.editing : ""}`}>
      <div className={styles.header}>
        {editMode ? (
          <div className={styles.editBadge}>Redigeringsläge</div>
        ) : (
          <h2 className={styles.title}>{formData.tname}</h2>
        )}

        {!editMode && (
          <section className={styles.editIcon}>
            <GrEdit onClick={() => setEditMode(true)} />
          </section>
        )}
      </div>

      {editMode && (
        <input
          className={styles.titleInput}
          value={formData.tname}
          onChange={(e) =>
            setFormData({
              ...formData,
              tname: e.target.value,
            })
          }
        />
      )}

      <section>
        <h5 className={styles.subtitle}>Beskrivning:</h5>

        <div className={styles.description}>
          {editMode ? (
            <textarea
              className={styles.descriptionInput}
              value={formData.tdescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tdescription: e.target.value,
                })
              }
            />
          ) : (
            formData.tdescription || "Ingen beskrivning tillgänglig."
          )}
        </div>
      </section>

      <section className={styles.infoRow}>
        <div className={styles.infoItem}>
          <span className={styles.label}>Tid</span>
          <span className={styles.value}>
            {editMode ? (
              <input
                className={styles.smallInput}
                type="number"
                value={formData.tduration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tduration: Number(e.target.value),
                  })
                }
              />
            ) : formData.tduration ? (
              `${formData.tduration} min`
            ) : (
              "Ej angiven"
            )}
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Pris</span>
          <span className={styles.value}>
            {editMode ? (
              <input
                className={styles.smallInput}
                type="number"
                value={formData.tprice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tprice: Number(e.target.value),
                  })
                }
              />
            ) : formData.tprice ? (
              `${formData.tprice} kr`
            ) : (
              "Ej angivet"
            )}
          </span>
        </div>
      </section>

      {editMode ? (
        <div className={styles.actions}>
          <button className={styles.saveButton} onClick={updateTreatment}>
            Spara
          </button>

          <button
            className={styles.cancelButton}
            onClick={() => setEditMode(false)}
          >
            Avbryt
          </button>
        </div>
      ) : (
        <div>
          {/* <button
            className={styles.editButton}
            onClick={() => setEditMode(true)}
          >
            Redigera
          </button> */}
        </div>
      )}

      {!editMode && (
        <div className={styles.footer}>
          <RiDeleteBinLine
            className={styles.deleteIcon}
            onClick={() => onDelete(treatment._id, formData.tname)}
          />
        </div>
      )}
    </div>
  );
};

export default TreatmentCard;
