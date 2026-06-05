import styles from "./oneClient.module.scss";

import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { Client } from "../types";

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

const NewTreatmen = () => {
  const client = useLoaderData() as Client;

  return (
    <div className={styles.newTreatmentStyle}>
      <h1>New Treatment Session</h1>
      <p>
        {client.name} {client.lastName}
      </p>
    </div>
  );
};

export default NewTreatmen;
