import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { Client } from "../types";

export const loader = async (args: LoaderFunctionArgs) => {
    const { params } = args;

    const { id } = params;

    const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/clients/' + id, {
        headers: {
            'Accepts': 'application/json'
        }
    })

    return response.json()
    
}


const OneClient = () => {
    const client = useLoaderData() as Client
    
    return(
    
        <div>
            <h1>{client.name} {client.lastName}</h1>
            <div>
                <p>Telefone: {client.telephone}</p>
                <p>e-mail: {client.email}</p>
                <p>Födelsedag: {client.dateOfBirth}</p>
            </div>
        </div>
    )
}

export default OneClient;