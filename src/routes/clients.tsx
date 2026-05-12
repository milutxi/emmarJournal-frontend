import { useEffect, useState } from "react";

import { Client } from "../types";
import ListClients from "../components/Clients/listClients";

import styles from "./clients.module.scss";

import ClientModal from "../components/ClientModal/clientModal";

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Fetch clients
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/clients",
          {
            headers: {
              Accept: "application/json",
            },
          },
        );

        const data = await response.json();

        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchData();
  }, []);

  // Delete client
  const deleteClient = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this client?",
    );

    if (!confirmed) return;

    try {
      await fetch(import.meta.env.VITE_BACKEND_URL + "/clients/" + id, {
        method: "DELETE",
      });

      setClients(clients.filter((client) => client._id !== id));
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  return (
    <div className={styles.clientStyle}>
      <h1 className={styles["clientStyle__title"]}>KUNDER</h1>

      {/* Add button */}
      <div className={styles["clientStyle__add"]}>
        <button
          className={styles["clientStyle__button"]}
          onClick={() => setIsCreateOpen(true)}
        >
          + Ny Kund
        </button>
      </div>

      {/* Clients list */}
      <div className={styles.clientListStyle}>
        {clients.map((client) => (
          <ListClients
            key={client._id}
            client={client}
            deleteClient={deleteClient}
            onEdit={setEditingClient}
          />
        ))}
      </div>

      {/* Shared modal for create + edit */}
      {(isCreateOpen || editingClient) && (
        <ClientModal
          initialData={editingClient || null}
          onClose={() => {
            setIsCreateOpen(false);
            setEditingClient(null);

            // Refresh clients after close
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default Clients;
