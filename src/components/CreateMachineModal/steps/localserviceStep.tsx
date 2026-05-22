import styles from "../createMachineModal.module.scss";
import type { CreateMachineForm } from "../../../types";

type Props = {
  formData: CreateMachineForm;

  setFormData: React.Dispatch<
    React.SetStateAction<CreateMachineForm>
  >;
};

const LocalserviceStep = ({
  formData,
  setFormData,
}: Props) => {
  return (
    <div className={styles.formSection}>
      <h2>LOKAL Service</h2>

      <div className={styles.rowDates}>

  <div className={styles.inputGroup}>
    <label>Servicedatum</label>

    <input
      type="date"
      value={formData.mServiceLokalDate}
      onChange={(e) =>
        setFormData({
          ...formData,
          mServiceLokalDate: e.target.value,
        })
      }
    />
  </div>

  <div className={styles.inputGroup}>
    <label>Nästa service</label>

    <input
      type="date"
      value={formData.mServiceLokalNextDate}
      onChange={(e) =>
        setFormData({
          ...formData,
          mServiceLokalNextDate: e.target.value,
        })
      }
    />
  </div>

</div>
<div className={styles.inputGroup}>
  <label>Kommentarer</label>

  <textarea
    rows={6}
    value={formData.mCommentsLokalService}
    onChange={(e) =>
      setFormData({
        ...formData,
        mCommentsLokalService: e.target.value,
      })
    }
  />
</div>
      
    </div>
  );
};

export default LocalserviceStep;