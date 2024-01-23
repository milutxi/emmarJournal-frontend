import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { Client } from "../types";
import ListClients from "../components/Clients/listClients";
import styles from './clients.module.scss'
import CreateClient from "../components/CreateClient/createClient";
import { Link } from "react-router-dom";

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

    const addClientClick = () => {
        <CreateClient />
    }

    return(
        <div className={styles.clientStyle}>
            <h1 className={styles["clientStyle__title"]}>KUNDER</h1>
            
                <div className={styles["clientStyle__add"]} >
                    {/* // on page load show list, add button onclick to show form */}
                    <Link to ="/addClient">
                        <button
                            className={styles["clientStyle__button"]}
                            onClick={addClientClick}>
                            +
                        </button> 
                    </Link>
                </div>
                {/* <div>
                    looking field & icon lens
                </div> */}
            
            <div>
                {data?.clients.map(client => <ListClients client={client} />)}
            </div>
        </div>
    )
}

export default Clients;