import { Dispatch, SetStateAction } from "react";
import { CreateMachineForm } from "../../../types";
import styles from "../createMachineModal.module.scss";

type Props = {
  formData: CreateMachineForm;
  setFormData: Dispatch<SetStateAction<CreateMachineForm>>;
};

const ParametrarStep = ({ formData, setFormData }: Props) => {
  const hasParameters = formData.parameterDefinitions.length > 0;

  const handleParameterRequirementChange = (needsParameters: boolean) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      parameterDefinitions: needsParameters
        ? currentFormData.parameterDefinitions.length > 0
          ? currentFormData.parameterDefinitions
          : [{ label: "", unit: "" }]
        : [],
    }));
  };

  const addParameterDefinition = () => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      parameterDefinitions: [
        ...currentFormData.parameterDefinitions,
        { label: "", unit: "" },
      ],
    }));
  };

  const updateParameterDefinition = (
    index: number,
    key: "label" | "unit",
    value: string,
  ) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      parameterDefinitions: currentFormData.parameterDefinitions.map(
        (parameter, parameterIndex) =>
          parameterIndex === index
            ? {
                ...parameter,
                [key]: value,
              }
            : parameter,
      ),
    }));
  };

  const removeParameterDefinition = (index: number) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      parameterDefinitions: currentFormData.parameterDefinitions.filter(
        (_, parameterIndex) => parameterIndex !== index,
      ),
    }));
  };

  return (
    <div className={styles.formSection}>
      <h2>PARAMETRAR</h2>

      <div className={styles.inputGroup}>
        <p className={styles.helperText}>
          Lägg till de parametrar som ska visas när maskinen används i en
          behandling. I journalen fyller personalen bara i värdet.
        </p>
      </div>

      <div className={styles.settingsSelector}>
        <span>Behöver maskinen parametrar? </span>
        <label className={styles.settingsOption}>
          <input
            type="radio"
            name="needsParameters"
            checked={hasParameters}
            onChange={() => handleParameterRequirementChange(true)}
          />
          Ja
        </label>

        <label className={styles.settingsOption}>
          <input
            type="radio"
            name="needsParameters"
            checked={!hasParameters}
            onChange={() => handleParameterRequirementChange(false)}
          />
          Nej
        </label>
      </div>

      {hasParameters && (
        <div className={styles.parameterDefinitionList}>
          <div className={styles.parameterDefinitionHeader}>
            <span>Parameternamn</span>
            <span>Enhet</span>
          </div>

          {formData.parameterDefinitions.map((parameter, index) => (
            <div key={index} className={styles.parameterDefinitionRow}>
              <input
                type="text"
                aria-label="Parameternamn"
                placeholder="T.ex. Energi"
                value={parameter.label}
                onChange={(event) =>
                  updateParameterDefinition(index, "label", event.target.value)
                }
              />

              <input
                type="text"
                aria-label="Enhet"
                placeholder="T.ex. J/cm²"
                value={parameter.unit ?? ""}
                onChange={(event) =>
                  updateParameterDefinition(index, "unit", event.target.value)
                }
              />

              <button
                type="button"
                className={styles.removeButton}
                onClick={() => removeParameterDefinition(index)}
              >
                Ta bort
              </button>
            </div>
          ))}

          <button
            type="button"
            className={styles.addButton}
            onClick={addParameterDefinition}
          >
            + Lägg till parameter
          </button>
        </div>
      )}
    </div>
  );
};

export default ParametrarStep;
