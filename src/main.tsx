import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.scss'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Index from './routes/index.tsx'
//import ClientsList from './components/Clients/listClients.tsx'
import Journal from './routes/journal.tsx'
import Treatments from './routes/treatments.tsx'
import Machines from './routes/machines.tsx'
import Clients, {loader as clientsLoader} from './routes/clients.tsx'


//import CreateClient, { action as createClientAction } from './components/CreateClient/createClient.tsx'
//import Clients from './routes/Clients/clients.tsx'


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
        loader: clientsLoader,
        element: <Clients />
        //element: <ClientsList />,

        //action: createClientAction,
       // element: <CreateClient />,

      },
      {
        path: "treatments",
        element: <Treatments />
      },
      {
        path: "machines",
        element: <Machines />
      }
    ]
  }
])


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

