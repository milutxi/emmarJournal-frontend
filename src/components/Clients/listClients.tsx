import { Client } from "../../types";
import styles from './listClients.module.scss'
import { RiDeleteBinLine } from "react-icons/ri";
//import { GrEdit } from "react-icons/gr";
import { Link } from "react-router-dom";

interface Props {
    client: Client;
    deleteClient : (id: string) => void;
}

const ListClients = ({ client, deleteClient }: Props) => {

    return(
        <div className={styles.list} key={client._id}>
            <Link to={`/clients/${client._id}`} className={styles["list__data"]} >
              
                    <div className={styles["list__dataName"]}>{client.name} {client.lastName}</div>
                    <div className={styles["list__dataTelephone"]}>{client.telephone}</div>
                    <div className={styles["list__dataEmail"]}>{client.email}</div>
                
            </Link>
           <div className={styles["list__icons"]}>

            <section className={styles["list__delete"]}>
                <RiDeleteBinLine onClick={()=> deleteClient(client._id)} />
            </section>
{/*         
            <section className={styles["list__edit"]}>
                <GrEdit />
            </section> */}
           </div>

        </div>
    )
}

export default ListClients;