//I decide not to use it as a loader, since is too small for this, better as component card directly in the page.




// //import styles from "./oneTreatment.module.scss";
// import { useState } from "react";
// import { Treatment } from "../types";
// import { LoaderFunctionArgs, useLoaderData } from "react-router";

// export const loader = async ({ params }: LoaderFunctionArgs) => {
//   const { id } = params;
//   const response = await fetch(
//     import.meta.env.VITE_BACKEND_URL + "/treatment/" + id,
//     {
//       headers: {
//         Acdept: "application/json",
//       },
//     },
//   );

//   return response.json();
// };

// const OneTreatment = () => {
//   const treatment = useLoaderData() as Treatment;

//   const [editMode, setEditMode] = useState(false);

//   const [formData, setFormData] = useState({
//     tname: treatment.tname,
//     tdescription: treatment.tdescription,
//     tduration: treatment.tduration,
//     tprice: treatment.tprice,
//   });

//   const updateTreatment = async () => {
//     const response = await fetch(
//       import.meta.env.VITE_BACKEND_URL + "/treatment/" + treatment._id,
//       {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       },
//     );

//     if (!response.ok) {
//       throw new Error("Failed to update treatment");
//     }

//     const updatedTreatment = await response.json();

//     setFormData({
//       tname: updatedTreatment.tname,
//       tdescription: updatedTreatment.tdescription,
//       tduration: updatedTreatment.tduration,
//       tprice: updatedTreatment.tprice,
//     });

//     setEditMode(false);

//     window.location.reload();
//   };

//   return (
//     <div>
//       {editMode ? (
//         <input
//           value={formData.tname}
//           onChange={(e) =>
//             setFormData({
//               ...formData,
//               tname: e.target.value,
//             })
//           }
//         />
//       ) : (
//         <h1>{treatment.tname}</h1>
//       )}
//       <section>
//         <h3>Beskrivning</h3>
//         <div>
//           {editMode ? (
//             <textarea
//               value={formData.tdescription}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   tdescription: e.target.value,
//                 })
//               }
//             />
//           ) : (
//             treatment.tdescription || "Ingen beskrivning tillgänglig."
//           )}
//         </div>
//       </section>

//       <section>
//         <h3>Tid</h3>

//         {editMode ? (
//           <input
//             type="number"
//             value={formData.tduration}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 tduration: Number(e.target.value),
//               })
//             }
//           />
//         ) : (
//           <p>
//             {treatment.tduration ? `${treatment.tduration} min` : "Ej angiven"}
//           </p>
//         )}
//       </section>

//       <section>
//         <h3>Pris</h3>

//         {editMode ? (
//           <input
//             type="number"
//             value={formData.tprice}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 tprice: Number(e.target.value),
//               })
//             }
//           />
//         ) : (
//           <p>{treatment.tprice ? `${treatment.tprice} kr` : "Ej angivet"}</p>
//         )}
//       </section>

//       {editMode ? (
//         <div>
//           <button onClick={updateTreatment}>Spara</button>

//           <button onClick={() => setEditMode(false)}>Avbryt</button>
//         </div>
//       ) : (
//         <button onClick={() => setEditMode(true)}>Redigera</button>
//       )}
//     </div>
//   );
// };

// export default OneTreatment;

