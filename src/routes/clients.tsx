import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { Client } from "../types";

export const loader = async (args: LoaderFunctionArgs) => {
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/clients', {
        headers: {
            'Accepts': 'application/json'
        }
    })

    return{
        clients: await response.json()
    }
}

const Clients = () => {
    const data = useLoaderData() as { clients: Client[] } | undefined

    return(

        <ul>
            {data?.clients.map(client => <li>{client.name}</li>)}
        </ul>

    )
}

export default Clients;