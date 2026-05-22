import styles from "../createMachineModal.module.scss";
import type { CreateMachineForm } from "../../../types";

type Props = {
  formData: CreateMachineForm;

  setFormData: React.Dispatch<
    React.SetStateAction<CreateMachineForm>
  >;
};

const TillverkarserviceStep = ({
  formData,
  setFormData,
}: Props) => {
  return (
    <div className={styles.formSection}>
      <h2>TILLVERKARService</h2>

      <div className={styles.rowDates}>

  <div className={styles.inputGroup}>
    <label>Servicedatum</label>

    <input
      type="date"
      value={formData.mServiceManufactureDate}
      onChange={(e) =>
        setFormData({
          ...formData,
          mServiceManufactureDate: e.target.value,
        })
      }
    />
  </div>

  <div className={styles.inputGroup}>
    <label>Nästa service</label>

    <input
      type="date"
      value={formData.mServiceManufactureNextDate}
      onChange={(e) =>
        setFormData({
          ...formData,
          mServiceManufactureNextDate: e.target.value,
        })
      }
    />
  </div>

</div>
<div className={styles.inputGroup}>
  <label>Kommentarer</label>

  <textarea
    rows={6}
    value={formData.mCommentsManufactureService}
    onChange={(e) =>
      setFormData({
        ...formData,
        mCommentsManufactureService:
          e.target.value,
      })
    }
  />
</div>
      
    </div>
  );
};

export default TillverkarserviceStep;