import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.scss'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Index from './routes/index.tsx'
import Journal from './routes/journal.tsx'
import Treatments from './routes/treatments.tsx'
import Machines from './routes/machines.tsx'
import Clients from './routes/clients.tsx'
import CreateClient, { action as createClientAction } from './components/CreateClient/createClient.tsx'
import OneClient, {loader as oneClientLoader} from './routes/oneClient.tsx'
import CreateMachine, { action as createMachineAction } from './components/CreateMachine/createMachine.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Index />
      },
      {
        path: "journal",
        element: <Journal />
      },
      {
        path: "clients",
        element: <Clients />
      },
      {
        path: "/clients/:id",
        loader: oneClientLoader,
        element: <OneClient />
      },
      {
        path: "treatments",
        element: <Treatments />
      },
      {
        path: "machines",
        element: <Machines />
      },
      {
        path: "addClient",
        action: createClientAction,
        element: <CreateClient />
      },
      {
        path: "addMachine",
        action: createMachineAction,
        element: <CreateMachine />
      }
    ]
  }
])


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

