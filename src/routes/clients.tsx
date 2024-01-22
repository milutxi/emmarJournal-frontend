import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { Client } from "../types";
import ListClients from "../components/Clients/listClients";

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

        <div>
            {data?.clients.map(client => <ListClients client={client} />)}
        </div>

    )
}

export default Clients;