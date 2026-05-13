// import { LoaderFunctionArgs, useLoaderData } from "react-router";
// import { Client } from "../types";
// import styles from './oneClient.module.scss'

// export const loader = async (args: LoaderFunctionArgs) => {
//     const { params } = args;

//     const { id } = params;

//     const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/clients/' + id, {
//         headers: {
//             'Accepts': 'application/json'
//         }
//     })

//     return response.json()

// }

// const formatDate = (date: Date | string) => {
//     // If the input is already a Date object, just format it
//     if (date instanceof Date) {
//         return new Intl.DateTimeFormat('en-US').format(date);
//     } else {
//         // If it's a string, parse it into a Date object first
//         const parsedDate = new Date(date);
//         // Check if parsing was successful
//         if (!isNaN(parsedDate.getTime())) {
//             return new Intl.DateTimeFormat('en-US').format(parsedDate);
//         } else {
//             // Return the original string if parsing failed
//             return date;
//         }
//     }
// };

// const OneClient = () => {
//     const client = useLoaderData() as Client

//     return(
//     <div className={styles.oneClientStyle}>
//         <div className={styles["oneClientStyle__left"]}>
//             <div className= {styles["oneClientStyle__card"]}>
//                 <div>
//                     <div className={styles["oneClientStyle__frame"]}>
//                     <div className={styles["oneClientStyle__frame2"]}>
//                     <div className= {styles["oneClientStyle__gubbe"]}>
//                         {/* client image or icon */}
//                     </div>
//                     </div>
//                     </div>
//                 </div>
//                 <h2 className={styles["oneClientStyle__name"]}>{client.name} {client.lastName}</h2>
//                 <div>
//                     <p>Telefone: {client.telephone}</p>
//                     <p>e-mail: {client.email}</p>
//                     <p>Födelsedag: {formatDate(client.dateOfBirth)}</p>
//                 </div>
//             </div>
//         </div>
//         <div className={styles["oneClientStyle__right"]}>
//             <h2>Medical History</h2>
//         </div>

//     </div>
//     )
// }

// export default OneClient;

import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { Client } from "../types";
import styles from "./oneClient.module.scss";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  const response = await fetch(
    import.meta.env.VITE_BACKEND_URL + "/clients/" + id,
    {
      headers: {
        Accept: "application/json",
      },
    },
  );

  return response.json();
};

const formatDate = (date: string) => {
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("en-GB").format(parsed);
};

const OneClient = () => {
  const client = useLoaderData() as Client;

  return (
    <div className={styles.oneClientStyle}>
      {/* LEFT SIDE */}
      <div className={styles.oneClientStyle__left}>
        <div className={styles.oneClientStyle__card}>
          <div className={styles.oneClientStyle__avatarWrapper}>
            <div className={styles.oneClientStyle__avatar}>
              {client.name?.[0]?.toUpperCase()}
              {client.lastName?.[0]?.toUpperCase()}
            </div>
          </div>

          <h2 className={styles.oneClientStyle__name}>
            {client.name} {client.lastName}
          </h2>

          <div className={styles.oneClientStyle__info}>
            <p>
              <strong>Telefon:</strong> {client.telephone}
            </p>
            <p>
              <strong>E-mail:</strong> {client.email}
            </p>
            <p>
              <strong>Födelsedag:</strong> {formatDate(client.dateOfBirth)}
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className={styles.oneClientStyle__right}>
        <div className={styles.oneClientStyle__header}>
          <h2>Medical History</h2>
        </div>

        {/* EMPTY STATE (future timeline area) */}
        <div className={styles.oneClientStyle__emptyState}>
          <p>No medical records yet</p>
          <span>Coming soon — appointments, notes, treatments...</span>
        </div>
      </div>
    </div>
  );
};

export default OneClient;
