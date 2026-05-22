import { Client } from "../../types";
import styles from "./clientModal.module.scss";

type Props = {
  onClose: () => void;
  initialData?: Client | null;
};

const ClientModal = ({ onClose, initialData }: Props) => {
  const isEdit = Boolean(initialData);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.currentTarget);

      const id = formData.get("id");

      const payload = {
        name: formData.get("name"),
        lastName: formData.get("lastName"),
        telephone: formData.get("telephone"),
        email: formData.get("email"),
        dateOfBirth: formData.get("dateOfBirth"),
      };

      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + (id ? `/clients/${id}` : "/clients"),
        {
          method: id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to save client");
      }

      onClose();

      //window.location.reload();
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        <h2 className={styles.title}>
          {isEdit ? "Redigera Kund" : "Skapa Ny Kund"}
        </h2>

        <form onSubmit={handleSubmit} className={styles.clientForm}>
          {isEdit && <input type="hidden" name="id" value={initialData?._id} />}

          <input
            name="name"
            placeholder="Förnamn"
            defaultValue={initialData?.name}
            required
            className={styles.input}
          />

          <input
            name="lastName"
            placeholder="Efternamn"
            defaultValue={initialData?.lastName}
            required
            className={styles.input}
          />

          <input
            name="telephone"
            placeholder="Telefonnummer"
            defaultValue={initialData?.telephone}
            required
            className={styles.input}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            defaultValue={initialData?.email}
            className={styles.input}
          />

          <input
            name="dateOfBirth"
            type="date"
            defaultValue={
              initialData?.dateOfBirth
                ? new Date(initialData.dateOfBirth).toISOString().split("T")[0]
                : ""
            }
            className={styles.input}
          />

          <button type="submit" className={styles.createBtn}>
            {isEdit ? "Spara ändringar" : "Skapa Kund"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClientModal;
