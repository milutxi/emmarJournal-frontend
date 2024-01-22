//import { Link } from "react-router-dom";
//import CreateClient from "../CreateClient/createClient";
//import CreateClient, { action as createClientAction } from './routes/CreateClient/createClient.tsx'

import { Client } from "../../types";

//state conditional 


const ListClients = ({ client }: {client: Client}) => {
    return(
        <div>

            <section>
                <div>{client.name} {client.lastName}</div>
                <div>{client.telephone}</div>
                <div>{client.email}</div>
            </section>
           
            <section>
                delete icon
            </section>
        
            <section>
                edit icon
            </section>

        </div>
    )
}

export default ListClients;


