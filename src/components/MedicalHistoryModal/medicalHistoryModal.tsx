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
    { key: "autoimmuneDisease", label: "Autoimmun sjukdom" },
    { key: "pacemaker", label: "Pacemaker" },
    { key: "cancer", label: "Cancer" },
    { key: "hepatitis", label: "Hepatit" },
    { key: "venerealDiseases", label: "Veneriska sjukdomar" },
    { key: "tattoos", label: "Tatueringar" },
    { key: "permanentFillers", label: "Permanenta fillers" },
    { key: "hypersensitiveSkin", label: "Överkänslig hud" },
    { key: "skinDiseases", label: "Hudsjukdomar" },
    { key: "heartProblems", label: "Hjärtproblem" },
    { key: "epilepsy", label: "Epilepsi" },
    { key: "hormonalChanges", label: "Hormonförändringar" },
    { key: "medication", label: "Äter receptbelagd medicin" },
    { key: "omega3", label: "Omega 3" },
    { key: "allergies", label: "Allergier" },
    { key: "anesthesiaReaction", label: "Biverkningar av lokalbedövning" },
    { key: "anaphylaxis", label: "Anafylaktisk chock" },
    { key: "bloodThinners", label: "Antikoagulation medicin" },
    { key: "hypertrophicScarring", label: "Hypertrofisk ärrbildning" },
  ];

  const detailFields = [
    {
      booleanKey: "medication",
      detailKey: "medicationDetails",
      label: "Beskriv medicinering",
    },
    {
      booleanKey: "allergies",
      detailKey: "allergyDetails",
      label: "Beskriv allergier",
    },
    {
      booleanKey: "anesthesiaReaction",
      detailKey: "anesthesiaReactionDetails",
      label: "Beskriv reaktion på anestesi",
    },
    {
      booleanKey: "anaphylaxis",
      detailKey: "anaphylaxisDetails",
      label: "Beskriv anafylaxi",
    },
    {
      booleanKey: "bloodThinners",
      detailKey: "bloodThinnerDetails",
      label: "Beskriv blodförtunnande behandling",
    },
    {
      booleanKey: "hypertrophicScarring",
      detailKey: "hypertrophicScarringDetails",
      label: "Beskriv hypertrofisk ärrbildning",
    },
  ];

  const textFields = [
    {
      key: "otherConditions",
      label: "Övriga medicinska tillstånd",
    },
    {
      key: "mhnotes",
      label: "Anteckningar",
    },
  ]

  return (
    <div>
      <button onClick={onClose}>X</button>
      <h2>Medicinsk Hälsodeklaration</h2>

      {booleanFields.map((field) => (
        <div key={field.key}>
          <label>{field.label}</label>
          <input
            type="checkbox"
            checked={
              medicalHistory[field.key as keyof MedicalHistoryType] ?? false
            }
            onChange={(e) =>
              setMedicalHistory({
                ...medicalHistory,
                [field.key]: e.target.checked,
              })
            }
          />
        </div>
      ))}

      {detailFields.map((field) => {
        const show =
          medicalHistory[field.booleanKey as keyof MedicalHistoryType];
        if (!show) return null;
        return (
          <div key={field.detailKey}>
            <label>{field.label}</label>
            <input
              type="text"
              value={
                (medicalHistory[
                  field.detailKey as keyof MedicalHistoryType
                ] as string) ?? ""
              }
              onChange={(e) =>
                setMedicalHistory({
                  ...medicalHistory,
                  [field.detailKey]: e.target.value,
                })
              }
            />
          </div>
        );
      })}

      {textFields.map((field) => (

        <div key={field.key}>
          <label>{field.label}</label>
          <input 
          type="text"
          value={
            (medicalHistory[field.key as keyof MedicalHistoryType] as string) ?? ""
          }
          onChange={(e) => 
            setMedicalHistory({
              ...medicalHistory,
              [field.key]: e.target.value,
            })
          }
          />

        </div>
        )
      )}
    </div>
  );
};

export default MedicalHistoryModal;
