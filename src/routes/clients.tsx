import { useEffect, useState } from "react";
import { Client } from "../types";
import ListClients from "../components/Clients/listClients";
import styles from './clients.module.scss'
import CreateClient from "../components/CreateClient/createClient";
import { Link, } from "react-router-dom";

const Clients = () => {
    const [clients, setClients] = useState<Client[]>([]);

    //rerender to get the updated list of clients
    useEffect(() => {
        const fetchData = async ()=> {
            try {
                const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/clients', {
                    headers: {
                        'Accepts': 'application/json'
                    }
                });

            const data = await response.json(); 

            setClients(data);

            } catch (error) {
            console.error("Error fetching clients: ", error);
            }
        };
        fetchData();
    }, []);


    const addClientClick = () => {
        <CreateClient />
    }

    const deleteClient = async (id: string) => {
        console.log("hola")

        try {
            await fetch(import.meta.env.VITE_BACKEND_URL + '/clients/' + id, {
                method: 'DELETE'
            });

            // Filter out the deleted client from the state
            setClients(clients.filter(client => client._id !== id));

        } catch (error) {
            console.error("Error deleting client ", error);
        }
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
            <div>
                {clients.map(client => 
                    <ListClients 
                        key={client._id}
                        client={client}
                        deleteClient={deleteClient} />
                )}
            </div>
        </div>
    )
}

export default Clients;