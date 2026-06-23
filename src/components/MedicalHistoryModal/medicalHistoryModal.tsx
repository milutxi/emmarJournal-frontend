//import styles from "./medicalHistoryModal.module.scss";

import { useState } from "react";
import { MedicalHistoryType } from "../../types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const MedicalHistoryModal = ({ onClose, isOpen }: Props) => {
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryType>({
    pregnant: false,
  });

  if (!isOpen) return null;

  const booleanFields = [
    { key: "pregnant", label: "Gravid" },
    { key: "breastfeeding", label: "Ammar" },
    { key: "diabetic", label: "Diabetes" },
    { key: "skinInfection", label: "Hudinfektion" },
    { key: "autoimmuneDisease", label: "Autoimmun sjuktom" },
    { key: "pacemaker", label: "" },
    { key: "cancer", label: "" },
    { key: "hepatitis", label: "" },
    { key: "tattoos", label: "" },
    { key: "permanentFillers", label: "" },
    { key: "hypersensitiveSkin", label: "" },
    { key: "skinDiseases", label: "" },
    { key: "heartProblems", label: "" },
    { key: "hormonalChanges", label: "" },
    { key: "medication", label: "" },
    { key: "omega3", label: "" },
    { key: "allergies", label: "" },
    { key: "anesthesiaReaction", label: "" },
    { key: "anaphylaxis", label: "" },
    { key: "bloodThinners", label: "" },
    { key: "hypertrophicScarring", label: "" },
  ];

  const detailFields = [
{
    booleanKey: "medication",
    detailKey: "medicationDetails",
    label: "Vilka Mediciner",
  },
  {
    booleanKey: "allergies",
    detailKey: "allergyDetails",
    label: "Vilka Allergier",
  },
  {
    booleanKey: "anesthesiaReaction",
    detailKey: "anesthesiaReactionDetails",
    label: "Anestesi Reaktion Details",
  },
  {
    booleanKey: "anaphylaxis",
    detailKey: "anaphylaxisDetails",
    label: "Anafilaksi Details",
  },
  {
    booleanKey: "bloodThinners",
    detailKey: "bloodThinnerDetails",
    label: "",
  },
  {
    booleanKey: "hypertrophicScarring",
    detailKey: "hypertrophicScarringDetails",
    label: "",
  },
  ];


  return (
    <div>
      <button onClick={onClose}>X</button>
      <h2>Medicinsk Hälsodeklaration</h2>


      <label>Gravid?</label>
      <input
        type="checkbox"
        checked={medicalHistory.pregnant}
        onChange={(e) =>
          setMedicalHistory({
            ...medicalHistory,
            pregnant: e.target.checked,
          })
        }
      />
    </div>
  );
};

export default MedicalHistoryModal;
