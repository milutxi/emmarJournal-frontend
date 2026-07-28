import { Machine, MachineSetting } from "../../types";
import styles from "./treatmentSessionMachineSettings.module.scss";
import {
  updateParameterValue,
  getSetupLevels,
  updateSetupPath,
  updateMachineSettingComment,
} from "../../utils/machineSettingsHelpers";

import { TbArrowBadgeRight } from "react-icons/tb";

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

      {machineSettings.map((setting, index) => {
        const selectedMachineId =
          typeof setting.machineId === "string"
            ? setting.machineId
            : setting.machineId._id;

        const selectedMachine = machines.find(
          (machine) => machine._id === selectedMachineId,
        );

        const setupLevels = selectedMachine
          ? getSetupLevels(
              selectedMachine.setupMenu ?? [],
              setting.setupPath ?? [],
            )
          : [];

        return (
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
              {setupLevels.length > 0 && (
                <div className={styles.setupSection}>
                  <h5>Setup / meny</h5>

                  <div className={styles.setupFlow}>
                    {setupLevels.map((levelOptions, levelIndex) => (
                      <div key={levelIndex} className={styles.setupFlowItem}>
                        <select
                          value={setting.setupPath?.[levelIndex] ?? ""}
                          onChange={(event) => {
                            const selectedValue = event.target.value;

                            const nextSetupPath = selectedValue
                              ? [
                                  ...(setting.setupPath ?? []).slice(
                                    0,
                                    levelIndex,
                                  ),
                                  selectedValue,
                                ]
                              : (setting.setupPath ?? []).slice(0, levelIndex);

                            onChange(
                              updateSetupPath(
                                machineSettings,
                                index,
                                nextSetupPath,
                              ),
                            );
                          }}
                        >
                          <option value="">Välj</option>

                          {levelOptions.map((option) => (
                            <option key={option.label} value={option.label}>
                              {option.label}
                            </option>
                          ))}
                        </select>

                        {levelIndex < setupLevels.length - 1 && (
                          <span className={styles.setupArrow}>
                            <TbArrowBadgeRight />
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
              {selectedMachineId && (
                <div className={styles.machineCommentSection}>
                  <h5>Kommentar för maskin</h5>

                  <textarea
                    value={setting.comment ?? ""}
                    rows={3}
                    placeholder="Lägg till kommentar för denna maskin..."
                    onChange={(event) =>
                      onChange(
                        updateMachineSettingComment(
                          machineSettings,
                          index,
                          event.target.value,
                        ),
                      )
                    }
                  />
                </div>
              )}
            </label>
          </div>
        );
      })}

      <button type="button" onClick={addMachineSetting}>
        + Lägg till maskin
      </button>
    </div>
  );
};

export default TreatmenSessionMachineSettings;
