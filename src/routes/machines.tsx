// import CreateMachine from "../components/CreateMachine/createMachine";
// import ListMachines from "../components/Machines/listMachines";
 import styles from "./machines.module.scss";
// import { Link } from "react-router-dom";
// import { Machine } from "../types";
// import { useEffect, useState } from "react";
 const Machines = () => {
//   const [machines, setMachines] = useState<Machine[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(
//           import.meta.env.VITE_BACKEND_URL + "/machine",
//           {
//             headers: {
//               Accepts: "application/json",
//             },
//           },
//         );

//         const data = await response.json();

//         setMachines(data);
//       } catch (error) {
//         console.error("Error fetching machines: ", error);
//       }
//     };
//     fetchData();
//   });

//   // const addMachineClick = () => {
//   //     <CreateMachine />
//   // }

   return (
    <div>
    <h1 className={styles["machinesStyle__title"]}>MASKINER</h1>
    <p>Page under construction</p>
    </div>
//     <div className={styles.machinesStyle}>
//       <h1 className={styles["machinesStyle__title"]}>MASKINER</h1>
//       <div className={styles["machinesStyle__add"]}>
//         {/* // on page load show list, add button onclick to show form */}
//         {/* <Link to ="/app/addMachine">
//                         <button
//                             className={styles["machinesStyle__button"]}
//                             onClick={addMachineClick}>
//                             CLICK HERE TO ADD A NEW MACHINE
//                         </button> 
//                     </Link> */}
//       </div>
//       <div>
//         {machines.map((machine) => (
//           <ListMachines key={machine._id} machine={machine} />
//         ))}
//       </div>
//     </div>
  );
 };

 export default Machines;
