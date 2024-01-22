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
            <h1>Clients</h1>
            <section>
                <div>
                    {/* // on page load show list, add button onclick to show form */}
                    <button>+</button> 
                </div>
                <div>
                    looking field & icon lens
                </div>
            </section>
            <section>
                {data?.clients.map(client => <ListClients client={client} />)}
            </section>
        </div>

    )
}

export default Clients;