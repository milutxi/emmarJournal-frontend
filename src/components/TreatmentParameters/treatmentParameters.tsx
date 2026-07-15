import { Machine, TreatmentSession, TreatmentParametersType } from "../../types";
import styles from "./treatmentParameters.module.scss";
import { treatmentParameterFields, treatmentParameterTextFields } from "../../config/treatmentParameterFields";

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
        {treatmentParameterFields
          .map((field) => {
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
              onChange={(event) => updateParameter(field.key, event.target.value)}
            />
          </label>
        ))}
      </div>
    </div>
    // <div>
    //   <h4>Behandlingsparametrar</h4>
    //   <div>
    //     <label>Våglängd (nm)</label>
    //     <input
    //       type="text"
    //       value={value.treatmentParameters?.wavelength || ""}
    //       onChange={(e) =>
    //         onUpdate({
    //           ...value.treatmentParameters,
    //           wavelength: e.target.value,
    //         })
    //       }
    //     />
    //   </div>
    //   {/* Not need for now pulseMode, defined in the backend */}
    //   <div>
    //     <label>Energitäthet (J/cm<sup>2</sup>)</label>
    //     <input
    //       type="text"
    //       value={value.treatmentParameters?.energyDensity || ""}
    //       onChange={(e) =>
    //         onUpdate({
    //           ...value.treatmentParameters,
    //           energyDensity: e.target.value,
    //         })
    //       }
    //     />
    //   </div>
    //   <div>
    //     <label>Pulsenergi (mJ)</label>
    //     <input
    //       type="text"
    //       value={value.treatmentParameters?.pulseEnergy || ""}
    //       onChange={(e) =>
    //         onUpdate({
    //           ...value.treatmentParameters,
    //           pulseEnergy: e.target.value,
    //         })
    //       }
    //     />
    //   </div>
    //   <div>
    //     <label>Spotstorlek (mm)</label>
    //     <input
    //       type="text"
    //       value={value.treatmentParameters?.spotSize || ""}
    //       onChange={(e) =>
    //         onUpdate({
    //           ...value.treatmentParameters,
    //           spotSize: e.target.value,
    //         })
    //       }
    //     />
    //   </div>
    //   <div>
    //     <label>Frekvens (Hz)</label>
    //     <input
    //       type="text"
    //       value={value.treatmentParameters?.frequency || ""}
    //       onChange={(e) =>
    //         onUpdate({
    //           ...value.treatmentParameters,
    //           frequency: e.target.value,
    //         })
    //       }
    //     />
    //   </div>
    //   <div>
    //     <label>Puls Duration (ms)</label>
    //     <input
    //       type="text"
    //       value={value.treatmentParameters?.pulseDuration || ""}
    //       onChange={(e) =>
    //         onUpdate({
    //           ...value.treatmentParameters,
    //           pulseDuration: e.target.value,
    //         })
    //       }
    //     />
    //   </div>
    //   <div>
    //     <label>Kylning använd?</label>
    //     <label>
    //       <input
    //         type="radio"
    //         name="coolingUsed"
    //         checked={value.treatmentParameters?.coolingUsed === true}
    //         onChange={() =>
    //           onUpdate({
    //             ...value.treatmentParameters,
    //             coolingUsed: true,
    //           })
    //         }
    //       />
    //       Ja
    //     </label>
    //     <label>
    //       <input
    //         type="radio"
    //         name="coolingUsed"
    //         checked={value.treatmentParameters?.coolingUsed === false}
    //         onChange={() =>
    //           onUpdate({
    //             ...value.treatmentParameters,
    //             coolingUsed: false,
    //           })
    //         }
    //       />
    //       Nej
    //     </label>
    //   </div>
    //   <div>
    //     <label>Parametrar Kommentär:</label>
    //     <input
    //       type="text"
    //       value={value.treatmentParameters?.tpComment || ""}
    //       onChange={(e) =>
    //         onUpdate({
    //           ...value.treatmentParameters,
    //           tpComment: e.target.value,
    //         })
    //       }
    //     />
    //   </div>
    // </div>
  );
};

export default TreatmentParameters;
