import { useEffect, useState } from "react";
import { useActionData } from "react-router-dom";

import { Client } from "../types";
import ListClients from "../components/Clients/listClients";
import CreateClient from "../components/CreateClient/createClient";

import styles from "./clients.module.scss";

type ActionData = {
  success?: boolean;
  message?: string;
};
const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const actionData = useActionData() as ActionData;

  //rerender to get the updated list of clients
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/clients",
          {
            headers: {
              Accepts: "application/json",
            },
          },
        );

        const data = await response.json();

        setClients(data);
      } catch (error) {
        console.error("Error fetching clients: ", error);
      }
    };
    fetchData();
  }, []);

  // Close modal when submit is successful
  useEffect(() => {
    if (actionData?.success) {
      setIsCreateOpen(false);
      //refresh list after creation
      const refresh = async () => {
        const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/clients");
        const data = await res.json();
        setClients(data);
      };

      refresh();
    }
  }, [actionData]);

  const deleteClient = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this client?",
    );

    if (confirmed) {
      try {
        await fetch(import.meta.env.VITE_BACKEND_URL + "/clients/" + id, {
          method: "DELETE",
        });

        // Filter out the deleted client from the state
        setClients(clients.filter((client) => client._id !== id));
      } catch (error) {
        console.error("Error deleting client ", error);
      }
    }
  };

  return (
    <div className={styles.clientStyle}>
      <h1 className={styles["clientStyle__title"]}>KUNDER</h1>

      <div className={styles["clientStyle__add"]}>
        <button
          className={styles["clientStyle__button"]}
          onClick={() => setIsCreateOpen(true)}
        >
          +
        </button>
      </div>
      <div>
        {clients.map((client) => (
          <ListClients
            key={client._id}
            client={client}
            deleteClient={deleteClient}
          />
        ))}
      </div>
      {/* MODAL */}
      {isCreateOpen && <CreateClient onClose={() => setIsCreateOpen(false)} />}
    </div>
  );
};

export default Clients;
