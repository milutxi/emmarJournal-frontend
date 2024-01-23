//import { Link } from "react-router-dom";
//import CreateClient from "../CreateClient/createClient";
//import CreateClient, { action as createClientAction } from './routes/CreateClient/createClient.tsx'

import { Client } from "../../types";
import styles from './listClients.module.scss'
import { RiDeleteBinLine } from "react-icons/ri";
import { GrEdit } from "react-icons/gr";
//state conditional 


const ListClients = ({ client }: {client: Client}) => {
    return(
        <div className={styles.list}>

            <section className={styles["list__data"]}>
                <div className={styles["list__dataName"]}>{client.name} {client.lastName}</div>
                <div className={styles["list__dataTelephone"]}>{client.telephone}</div>
                <div className={styles["list__dataEmail"]}>{client.email}</div>
            </section>
           <div className={styles["list__icons"]}>

            <section className={styles["list__delete"]}>
                <RiDeleteBinLine />
            </section>
        
            <section className={styles["list__edit"]}>
                <GrEdit />
            </section>
           </div>

        </div>
    )
}

export default ListClients;


