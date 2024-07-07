import CreateMachine from '../components/CreateMachine/createMachine';
import styles from './machines.module.scss'
import { Link } from 'react-router-dom';
const Machines = () => {

    const addMachineClick = () => {
        <CreateMachine />
    }

    return (
        <div className={styles.machinesStyle}>
            <h1 className={styles["machinesStyle__title"]}>MASKINER</h1>
            <div className={styles["machinesStyle__add"]} >
                    {/* // on page load show list, add button onclick to show form */}
                    <Link to ="/addMachine">
                        <button
                            className={styles["machinesStyle__button"]}
                            onClick={addMachineClick}>
                            CLICK HERE TO ADD A NEW MACHINE
                        </button> 
                    </Link>
                </div>
        </div>
    )
}

export default Machines;