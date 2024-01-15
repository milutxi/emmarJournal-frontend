import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.scss'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Index from './routes/index.tsx'


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
        path: "client",
        element: <h1>KUNDER</h1>
      },
      {
        path: "treatments",
        element: <h1>BEHANDLINGAR</h1>
      },
      {
        path: "machines",
        element: <h1>MACHINES</h1>
      }
    ]
  }
])


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

//JOURNAL, KUNDER, BEHANDLINGAR, MACHINES
