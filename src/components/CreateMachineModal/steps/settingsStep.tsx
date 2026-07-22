import styles from "../createMachineModal.module.scss";
import { Dispatch, SetStateAction } from "react";
import { CreateMachineForm } from "../../../types";

type Props = {
  formData: CreateMachineForm;
  setFormData: Dispatch<SetStateAction<CreateMachineForm>>;
};

const SettingsStep = ({ formData, setFormData }: Props) => {


  return (
    <div className={styles.formSection}>
      <h2>SETUP / MENY</h2>
 <div className={styles.inputGroup}>
        <label>Setup / meny</label>

        <p className={styles.helperText}>
          Här kommer du kunna lägga till meny, submeny och flera nivåer för
          maskinens setup.
        </p>
      </div>
     
    </div>
  );
};

export default SettingsStep;
