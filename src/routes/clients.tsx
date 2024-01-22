import { LoaderFunctionArgs, useLoaderData } from "react-router";

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

interface Client {
    _id: string;
    name: string;
    lastName: string;
    telephone: number;
    email: string;
    dateOfBirth: Date;
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