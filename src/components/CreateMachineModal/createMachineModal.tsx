import styles from "./createMachineModal.module.scss";
import { useState } from "react";
import BasicInfoStep from "./steps/basicInfoStep";
import { CreateMachineForm } from "../../types";
import AcquisitionStep from "./steps/acquisitionsStep";
import LocalserviceStep from "./steps/localserviceStep";
import TillverkarserviceStep from "./steps/tillverkarserviceStep";
import CommentsStep from "./steps/commentsStep";

type Props = {
  onClose: () => void;
};

const CreateMachineModal = ({ onClose }: Props) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CreateMachineForm>({
    mName: "",
    mModelNumber: "",
    mSerialNumber: "",
    mManufactureCompany: "",
    mManufactureYear: "",
    mDescription: "",
    mComments: "",
    mStartLeasingDate: "",
    mFinishLeasingDate: "",
    mPurchaseDate: "",
    mServiceLokalDate: "",
    mServiceManufactureDate: "",
    mCommentsLokalService: "",
    mCommentsManufactureService: "",
    mServiceLokalNextDate: "",
    mServiceManufactureNextDate: "",
    acquisitionType: "purchase",
  });

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/machine",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) throw new Error("Failed to create machine");

      onClose();
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
        <h1>Ny maskin</h1>

        <div className={styles.stepContent}>
          {step === 1 && (
            <BasicInfoStep formData={formData} setFormData={setFormData} />
          )}

          {step === 2 && (
            <AcquisitionStep formData={formData} setFormData={setFormData} />
          )}

          {step === 3 && (
            <LocalserviceStep formData={formData} setFormData={setFormData}/>
          )}

          {step === 4 && (
            <TillverkarserviceStep formData={formData} setFormData={setFormData}/>
          )}

          {step === 5 && (
            <CommentsStep formData={formData} setFormData={setFormData} />
          )
          
          }
        </div>

        <div className={styles.actions}>
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)}>Tillbaka</button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button onClick={() => setStep(step + 1)}>Nästa</button>
          ) : (
            <button onClick={handleSubmit}>Skapa maskin</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateMachineModal;
