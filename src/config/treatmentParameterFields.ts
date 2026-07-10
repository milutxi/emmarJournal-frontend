import { TreatmentParametersType } from "../types";

export type TreatmentParameterField = {
  key: keyof TreatmentParametersType;
  label: string;
  type?: "text" | "boolean";
};

export const treatmentParameterFields: TreatmentParameterField[] = [
  { key: "wavelength", label: "Våglängd" },
  { key: "pulseMode", label: "Pulsläge" },
  { key: "energyDensity", label: "Energitäthet" },
  { key: "pulseEnergy", label: "Pulsenergi" },
  { key: "spotSize", label: "Spotstorlek" },
  { key: "frequency", label: "Frekvens" },
  { key: "pulseDuration", label: "Pulslängd" },
  { key: "coolingUsed", label: "Kylning", type: "boolean" },
  { key: "tpComment", label: "Kommentar" },
];
