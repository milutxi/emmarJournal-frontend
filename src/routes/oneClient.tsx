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


const formatDate = (date: Date | string) => {
    // If the input is already a Date object, just format it
    if (date instanceof Date) {
        return new Intl.DateTimeFormat('en-US').format(date);
    } else {
        // If it's a string, parse it into a Date object first
        const parsedDate = new Date(date);
        // Check if parsing was successful
        if (!isNaN(parsedDate.getTime())) {
            return new Intl.DateTimeFormat('en-US').format(parsedDate);
        } else {
            // Return the original string if parsing failed
            return date;
        }
    }
};

const OneClient = () => {
    const client = useLoaderData() as Client
    
    return(
    
        <div>
            <h1>{client.name} {client.lastName}</h1>
            <div>
                <p>Telefone: {client.telephone}</p>
                <p>e-mail: {client.email}</p>
                <p>Födelsedag: {formatDate(client.dateOfBirth)}</p>
            </div>
        </div>
    )
}

export default OneClient;