import styles from "./createMachineModal.module.scss";
import { useState } from "react";
import BasicInfoStep from "./steps/basicInfoStep";
import { CreateMachineForm } from "../../types";
import AcquisitionStep from "./steps/acquisitionsStep";
import LocalserviceStep from "./steps/localserviceStep";
import TillverkarserviceStep from "./steps/tillverkarserviceStep";
import CommentsStep from "./steps/commentsStep";
import SettingsStep from "./steps/settingsStep";

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
    requiresTreatmentParameters: false,
    acquisitionType: "purchase",
    setupMenu: [],
    parameterDefinitions: [],
  });

  const handleSubmit = async () => {
    try {
      const cleanedParameterDefinitions = formData.parameterDefinitions.filter( (parameter) => parameter.label.trim(),);
      const payload = {
        ...formData,
        cleanedParameterDefinitions: cleanedParameterDefinitions,
        requiresTreatmentParameters: cleanedParameterDefinitions.length > 0,
      };

      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/machine",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
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
        <h1 className={styles.title}>Ny maskin</h1>

        <div className={styles.stepContent}>
          {step === 1 && (
            <BasicInfoStep formData={formData} setFormData={setFormData} />
          )}

          {step === 2 && (
            <AcquisitionStep formData={formData} setFormData={setFormData} />
          )}

          {step === 3 && (
            <LocalserviceStep formData={formData} setFormData={setFormData} />
          )}

          {step === 4 && (
            <TillverkarserviceStep
              formData={formData}
              setFormData={setFormData}
            />
          )}
          {step === 5 && (
            <SettingsStep
              formData={formData}
              setFormData={setFormData}
            />
          )}

          {step === 6 && (
            <CommentsStep formData={formData} setFormData={setFormData} />
          )}
        </div>

        <div className={styles.actions}>
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)}>Tillbaka</button>
          ) : (
            <div />
          )}

          {step < 6 ? (
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
