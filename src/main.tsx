import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.scss'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Index from './routes/index.tsx'
import CreateClient, { action as createClientAction } from './routes/CreateClient/createClient.tsx'
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
        element: <h1>JOURNAL</h1>
      },
      {
        path: "clients",
        action: createClientAction,
        element: <CreateClient />,
      },
      {
        path: "treatments",
        element: <h1>BEHANDLINGAR</h1>
      },
      {
        path: "machines",
        element: <h1>MACHINES</h1>
      },
      
    ]
  }
])


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

