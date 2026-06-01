import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import "./App.scss";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Index from "./routes/index.tsx";
import Journal from "./routes/journal.tsx";
import Treatments from "./routes/treatments.tsx";
import Machines from "./routes/machines.tsx";
import Clients from "./routes/clients.tsx";
import OneClient, { loader as oneClientLoader } from "./routes/oneClient.tsx";
import OneMachine, {
  loader as oneMachineLoader,
} from "./routes/oneMachine.tsx";
// import OneTreatment, {
//   loader as oneTreatmentLoader,
// } from "./routes/oneTreatment.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/app",
    element: <App />,
    children: [
      {
        path: "journal",
        element: <Journal />,
      },
      {
        path: "clients",
        element: <Clients />,
      },
      {
        path: "clients/:id",
        loader: oneClientLoader,
        element: <OneClient />,
      },
      {
        path: "treatments",
        element: <Treatments />,
      },
      // {
      //   path: "treatments/:id",
      //   loader: oneTreatmentLoader,
      //   element: <OneTreatment />,
      // },
      {
        path: "machines",
        element: <Machines />,
      },
      {
        path: "machines/:id",
        loader: oneMachineLoader,
        element: <OneMachine />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
