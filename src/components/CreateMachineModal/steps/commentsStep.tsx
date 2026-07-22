import styles from "../createMachineModal.module.scss";
import type { CreateMachineForm } from "../../../types";

type Props = {
  formData: CreateMachineForm;

  setFormData: React.Dispatch<React.SetStateAction<CreateMachineForm>>;
};

const CommentsStep = ({ formData, setFormData }: Props) => {
  return (
    <div className={styles.formSection}>
      <h2>KOMMENTARER</h2>

      <div className={styles.inputGroup}>
        <p className={styles.helperText}>
          Extra kommentarer relevant om maskinen.
        </p>
        <textarea
          rows={6}
          value={formData.mComments}
          onChange={(e) =>
            setFormData({
              ...formData,
              mComments: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
};

export default CommentsStep;
