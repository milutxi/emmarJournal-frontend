import { ActionFunctionArgs, Form } from "react-router-dom";
import styles from "./createClient.module.scss";

export const action = async (args: ActionFunctionArgs) => {
  const { request } = args;

  const formData = await request.formData();

  const name = formData.get("name");
  const lastName = formData.get("lastName");
  const telephone = formData.get("telephone");
  const email = formData.get("email");
  const dateOfBirth = formData.get("dateOfBirth");

  const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/clients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, lastName, telephone, email, dateOfBirth }),
  });

  if (!response.ok) {
    const errorData = await response.json();

    return {
      success: false,
      message: errorData.message || "Could not create client",
    };
  }

  return { success: true };
};

//props from parent modal controller
type Props = {
  onClose: () => void;
};

const CreateClient = ({ onClose }: Props) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        <h2 className={styles.title}>Skapa Ny Kund</h2>

        <Form method="post" action="." className={styles.clientForm}>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Förnamn"
            required
            className={styles.input}
          />

          <input
            id="lastName"
            type="text"
            name="lastName"
            placeholder="Efternamn"
            required
            className={styles.input}
          />

          <input
            id="telephone"
            type="text"
            name="telephone"
            placeholder="Telefonnummer"
            required
            className={styles.input}
          />

          <input
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            className={styles.input}
          />

          <input
            id="dateOfBirth"
            type="date"
            name="dateOfBirth"
            className={styles.input}
          />

          <button type="submit" className={styles.createBtn}>
            Skapa Kund
          </button>
        </Form>
      </div>
    </div>
  );
};

export default CreateClient;
