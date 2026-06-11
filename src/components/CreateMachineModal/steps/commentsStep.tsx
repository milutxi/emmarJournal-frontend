import styles from "../createMachineModal.module.scss";
import type { CreateMachineForm } from "../../../types";

type Props = {
  formData: CreateMachineForm;

  setFormData: React.Dispatch<
    React.SetStateAction<CreateMachineForm>
  >;
};

const CommentsStep = ({
  formData,
  setFormData,
}: Props) => {
  return (
    <div className={styles.formSection}>
      {/* <div >

      <label className={styles.parameters} >
  Requires Treatment Parameters?
</label>

<input
  type="checkbox"
  checked={formData.requiresTreatmentParameters}
  onChange={(e) =>
    setFormData({
      ...formData,
      requiresTreatmentParameters: e.target.checked,
    })
  }
/>
  </div> */}

   <h3>Maskinen kräver behandlingsparametrar?</h3>

  <div className={styles.acquisitionSelector}>
    <label className={styles.acquisitionOption}>
      <input
        type="radio"
        name="requiresTreatmentParameters"
        checked={formData.requiresTreatmentParameters === true}
        onChange={() =>
          setFormData({
            ...formData,
            requiresTreatmentParameters: true,
          })
        }
      />
      Ja
    </label>

    <label className={styles.acquisitionOption}>
      <input
        type="radio"
        name="requiresTreatmentParameters"
        checked={formData.requiresTreatmentParameters === false}
        onChange={() =>
          setFormData({
            ...formData,
            requiresTreatmentParameters: false,
          })
        }
      />
      Nej
    </label>
  </div>

<div className={styles.inputGroup}>
  <label>Kommentarer</label>

  <textarea
    rows={6}
    value={formData.mComments}
    onChange={(e) =>
      setFormData({
        ...formData,
        mComments:
          e.target.value,
      })
    }
  />
</div>
</div>

)
};

export default CommentsStep;

