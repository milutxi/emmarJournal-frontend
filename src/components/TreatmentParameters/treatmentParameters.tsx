import {
  Machine,
  TreatmentSession,
  TreatmentParametersType,
} from "../../types";
import styles from "./treatmentParameters.module.scss";
import {
  treatmentParameterFields,
  treatmentParameterTextFields,
} from "../../config/treatmentParameterFields";

type Props = {
  value: TreatmentSession;
  machines: Machine[];
  onUpdate: (settings: TreatmentParametersType) => void;
};
const TreatmentParameters = ({ value, machines, onUpdate }: Props) => {
  const selectedMachines = machines.filter((m) =>
    value.machineIds.includes(m._id),
  );

  const requiresParameters = selectedMachines.some(
    (m) => m.requiresTreatmentParameters,
  );

  if (!requiresParameters) return null;

  const updateParameter = (
    key: keyof TreatmentParametersType,
    parameterValue: string | boolean,
  ) => {
    onUpdate({
      ...value.treatmentParameters,
      [key]: parameterValue,
    });
  };

  return (
    <div className={styles.treatmentParameters}>
      <h4 className={styles.formSectionTitle}>Behandlingsparametrar</h4>

      <div className={styles.parameterGrid}>
        {treatmentParameterFields.map((field) => {
          if (field.type === "boolean") {
            return (
              <label key={field.key} className={styles.booleanField}>
                <span className={styles.parameterLabel}>{field.label}</span>

                <input
                  type="checkbox"
                  checked={Boolean(value.treatmentParameters?.[field.key])}
                  onChange={(event) =>
                    updateParameter(field.key, event.target.checked)
                  }
                />
              </label>
            );
          }

          return (
            <label key={field.key} className={styles.parameterField}>
              <span className={styles.parameterLabel}>{field.label}</span>

              <input
                type="text"
                value={(value.treatmentParameters?.[field.key] as string) ?? ""}
                onChange={(event) =>
                  updateParameter(field.key, event.target.value)
                }
              />
            </label>
          );
        })}

        {treatmentParameterTextFields.map((field) => (
          <label key={field.key} className={styles.parameterTextField}>
            <span>{field.label}</span>

            <textarea
              value={(value.treatmentParameters?.[field.key] as string) ?? ""}
              onChange={(event) =>
                updateParameter(field.key, event.target.value)
              }
            />
          </label>
        ))}
      </div>
    </div>
  );
};

export default TreatmentParameters;
