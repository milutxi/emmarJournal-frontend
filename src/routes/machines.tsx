// import CreateMachine from "../components/CreateMachine/createMachine";

import ListMachines from "../components/Machines/listMachines";
import styles from "./machines.module.scss";
//import { Link } from "react-router-dom";
 import { Machine } from "../types";
import { useEffect, useState } from "react";
const Machines = () => {
    const [machines, setMachines] = useState<Machine[]>([]);

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

  return (
   <div className={styles.machinesStyle}>
  
  <div className={styles["machinesStyle__top"]}>
    <h1 className={styles["machinesStyle__title"]}>
      MASKINER
    </h1>

    {/* future button/filter area */}
    <div className={styles["machinesStyle__actions"]}>
      {/* button goes here later */}
    </div>
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

</div>
 
  );
};

export default Machines;
