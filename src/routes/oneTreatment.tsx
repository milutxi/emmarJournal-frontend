import styles from "./oneTreatment.module.scss";
import { Treatment } from "../types";
import { LoaderFunctionArgs, useRouteLoaderData } from "react-router";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const {id} = params;
  const response = await fetch (
    import.meta.env.VITE_BACKEND_URL + "/treatment/" + id,
    {
      headers: {
        Acdept: "application/json",
      },
    },
  );

  return response.json();

};

const OneTreatment = () => {
  const treatment = useRouteLoaderData() as Treatment;
  
  return (
    <div>
      <h1>{treatment.tname}</h1>
    </div>
  );
};

export default OneTreatment;
