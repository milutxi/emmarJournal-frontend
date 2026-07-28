import { Machine, MachineSetting } from "../../types";
import styles from "./treatmentSessionMachineSettings.module.scss";
import { updateParameterValue } from "../../utils/machineSettingsHelpers";

type Props = {
  machines: Machine[];
  machineSettings: MachineSetting[];
  onChange: (MachineSettings: MachineSetting[]) => void;
};

const TreatmenSessionMachineSettings = ({
  machines,
  machineSettings,
  onChange,
}: Props) => {
  const addMachineSetting = () => {
    onChange([
      ...machineSettings,
      {
        machineId: "",
        setupPath: [],
        parameters: [],
        comment: "",
      },
    ]);
  };

  const removeMachineSetting = (index: number) => {
    onChange(
      machineSettings.filter((_, machineIndex) => machineIndex !== index),
    );
  };

  const updateMachine = (index: number, machineId: string) => {
    const selectedMachine = machines.find(
      (machine) => machine._id === machineId,
    );

    onChange(
      machineSettings.map((setting, settingIndex) => {
        if (settingIndex !== index) return setting;

        return {
          machineId,
          setupPath: [],
          parameters:
            selectedMachine?.parameterDefinitions?.map((parameter) => ({
              label: parameter.label,
              unit: parameter.unit ?? "",
              value: "",
            })) ?? [],
          comment: "",
        };
      }),
    );
  };

  return (
    <div className={styles.machineSettings}>
      <h4>Maskiner</h4>

      {machineSettings.map((setting, index) => (
        <div key={index} className={styles.machineCard}>
          <div className={styles.machineCardHeader}>
            <strong>Maskin {index + 1}</strong>

            <button type="button" onClick={() => removeMachineSetting(index)}>
              Ta bort maskin
            </button>
          </div>

          <label>
            Välj maskin
            <select
              value={
                typeof setting.machineId === "string"
                  ? setting.machineId
                  : setting.machineId._id
              }
              onChange={(event) => updateMachine(index, event.target.value)}
            >
              <option value="">Välj maskin</option>

              {machines.map((machine) => (
                <option key={machine._id} value={machine._id}>
                  {machine.mName}
                </option>
              ))}
            </select>
            {setting.parameters.length > 0 && (
              <div className={styles.parameterSection}>
                <h5>Parametrar</h5>
                <div className={styles.parameterGrid}>
                  {setting.parameters.map((parameter, parameterIndex) => (
                    <div key={parameterIndex} className={styles.parameterRow}>
                      <span className={styles.parameterName}>
                        {parameter.label}:
                      </span>

                      <input
                        className={styles.parameterInput}
                        type="text"
                        value={parameter.value}
                        onChange={(event) =>
                          onChange(
                            updateParameterValue(
                              machineSettings,
                              index,
                              parameterIndex,
                              event.target.value,
                            ),
                          )
                        }
                      />

                      <span className={styles.parameterUnit}>
                        {parameter.unit || ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </label>
        </div>
      ))}

      <button type="button" onClick={addMachineSetting}>
        + Lägg till maskin
      </button>
    </div>
  );
};

export default TreatmenSessionMachineSettings;
