// import CreateMachine from "../components/CreateMachine/createMachine";

import ListMachines from "../components/Machines/listMachines";
import styles from "./machines.module.scss";
//import { Link } from "react-router-dom";
import { Machine } from "../types";
import { useEffect, useState } from "react";
import CreateMachineModal from "../components/CreateMachineModal/createMachineModal";
const Machines = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/machine",
          {
            headers: {
              Accepts: "application/json",
            },
          },
        );

        const data = await response.json();

        setMachines(data);
      } catch (error) {
        console.error("Error fetching machines: ", error);
      }
    };
    fetchData();
  });

  // const addMachineClick = () => {
  //     <CreateMachine />
  // }

  // const deleteMachine = async (id: string) => {
  //   const confirmed = window.confirm(
  //     "Are you sure you want to delete this machine?",
  //   );

  //   if (!confirmed) return;

  //   try {
  //     await fetch(import.meta.env.VITE_BACKEND_URL + "/machine/" + id, {
  //       method: "DELETE",
  //     });

  //     setMachines(machines.filter((machine) => machine._id !== id));
  //   } catch (error) {
  //     console.error("Error deleting machine:", error);
  //   }
  // };

  return (
    <div className={styles.machinesStyle}>
      <div className={styles["machinesStyle__top"]}>
        <h1 className={styles["machinesStyle__title"]}>MASKINER</h1>
        <button
          className={styles["machinesStyle__createButton"]}
          onClick={() => setShowCreateModal(true)}
        >
          + Ny maskin
        </button>
      </div>

      <div className={styles["machinesStyle__grid"]}>
        {machines.map((machine) => (
          <ListMachines
            key={machine._id}
            machine={machine}
            // deleteMachine={deleteMachine}
            // onEdit={setEditingMachine}
          />
        ))}
      </div>

      {showCreateModal && (
        <CreateMachineModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

export default Machines;
