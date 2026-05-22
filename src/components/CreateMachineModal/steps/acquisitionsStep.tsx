import styles from "../createMachineModal.module.scss";
import type { CreateMachineForm } from "../../../types";

type Props = {
  formData: CreateMachineForm;

  setFormData: React.Dispatch<React.SetStateAction<CreateMachineForm>>;
};

const AcquisitionStep = ({ formData, setFormData }: Props) => {
  return (
    <div className={styles.formSection}>
      <h2>Anskaffning</h2>
      <div className={styles.acquisitionSelector}>
        <label className={styles.acquisitionOption}>
          <input
            type="radio"
            name="acquisitionType"
            checked={formData.acquisitionType === "purchase"}
            onChange={() =>
              setFormData({
                ...formData,
                acquisitionType: "purchase",
              })
            }
          />
          Köp
        </label>

        <label className={styles.acquisitionOption}>
          <input
            type="radio"
            name="acquisitionType"
            checked={formData.acquisitionType === "leasing"}
            onChange={() =>
              setFormData({
                ...formData,
                acquisitionType: "leasing",
              })
            }
          />
          Leasing
        </label>
      </div>

{formData.acquisitionType === "purchase" ? (
<div className={styles.centeredDate}>
  <div className={styles.inputGroup}>
    <label>Inköpsdatum</label>

    <input
      type="date"
      value={formData.mPurchaseDate}
      onChange={(e) =>
        setFormData({
          ...formData,
          mPurchaseDate: e.target.value,
        })
      }
    />
  </div>
  </div>

) : (
<div className={styles.centeredDates}>
  <div className={styles.rowDates}>

    <div className={styles.inputGroup}>
      <label>Startdatum</label>

      <input
        type="date"
        value={formData.mStartLeasingDate}
        onChange={(e) =>
          setFormData({
            ...formData,
            mStartLeasingDate: e.target.value,
          })
        }
      />
    </div>

    <div className={styles.inputGroup}>
      <label>Slutdatum</label>

      <input
        type="date"
        value={formData.mFinishLeasingDate}
        onChange={(e) =>
          setFormData({
            ...formData,
            mFinishLeasingDate: e.target.value,
          })
        }
      />
    </div>
</div>
  </div>

)}
      

    </div>
  );
};

export default AcquisitionStep;
