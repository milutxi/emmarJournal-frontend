import { Machine, TreatmentBlock, TreatmentParametersType } from "../../types";
//import styles from "./treatmentParameters.module.scss";

type Props = {
  value: TreatmentBlock;
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

  return (
    <div>
      <h4>Behandlingsparametrar</h4>

      <div>
        <label>Våglängd</label>

        <input
          type="text"
          value={value.treatmentParameters?.wavelength || ""}
          onChange={(e) =>
            onUpdate({
              ...value.treatmentParameters,
              wavelength: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
};

export default TreatmentParameters;
