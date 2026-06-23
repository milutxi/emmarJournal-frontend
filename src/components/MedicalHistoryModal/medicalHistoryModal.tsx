import styles from "./medicalHistoryModal.module.scss";

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

  const booleanGroups = [
    {
      title: "Graviditet & Hormoner",
      fields: [
        { key: "pregnant", label: "Gravid" },
        { key: "breastfeeding", label: "Ammar" },
        { key: "hormonalChanges", label: "Hormonförändringar" },
      ],
    },
    {
      title: "Medicinska sjukdomar",
      fields: [
        { key: "diabetic", label: "Diabetes" },
        { key: "autoimmuneDisease", label: "Autoimmun sjukdom" },
        { key: "epilepsy", label: "Epilepsi" },
        { key: "hepatitis", label: "Hepatit" },
        { key: "venerealDiseases", label: "Veneriska sjukdomar" },
        { key: "cancer", label: "Cancer" },
      ],
    },
    {
      title: "Hjärta & Cirkulation",
      fields: [
        { key: "heartProblems", label: "Hjärtproblem" },
        { key: "pacemaker", label: "Pacemaker" },
        { key: "bloodThinners", label: "Blodförtunnande medicin" },
        { key: "omega3", label: "Omega 3" },
      ],
    },
    {
      title: "Hud",
      fields: [
        { key: "skinDiseases", label: "Hudsjukdomar" },
        { key: "skinInfection", label: "Hudinfektion" },
        { key: "hypersensitiveSkin", label: "Överkänslig hud" },
      ],
    },
    {
      title: "Hudbehandling",
      fields: [
        { key: "tattoos", label: "Tatueringar" },
        { key: "permanentFillers", label: "Permanenta fillers" },
        { key: "hypertrophicScarring", label: "Hypertrofisk ärrbildning" },
      ],
    },
    {
      title: "Läkemedel & Reaktioner",
      fields: [
        { key: "medication", label: "Äter receptbelagd medicin" },
        { key: "allergies", label: "Allergier" },
        { key: "anaphylaxis", label: "Anafylaktisk chock" },
        { key: "anesthesiaReaction", label: "Biverkningar av lokalbedövning" },
      ],
    },
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
  ];

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
        <h2 className={styles.title}>Medicinsk Hälsodeklaration</h2>
        <div className={styles.booleanSection}>
          {booleanGroups.map((group) => (
            <div key={group.title} className={styles.group}>
              <h3>{group.title}</h3>

              {group.fields.map((field) => (
                <label key={field.key} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={
                      (medicalHistory[
                        field.key as keyof MedicalHistoryType
                      ] as boolean) ?? false
                    }
                    onChange={(e) =>
                      setMedicalHistory({
                        ...medicalHistory,
                        [field.key]: e.target.checked,
                      })
                    }
                  />
                  {field.label}
                </label>
              ))}
            </div>
          ))}
        </div>
        <div className={styles.detailSection}>
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
        </div>
        <div className={styles.textSection}>
          {textFields.map((field) => (
            <div key={field.key}>
              <label>{field.label}</label>
              <input
                type="text"
                value={
                  (medicalHistory[
                    field.key as keyof MedicalHistoryType
                  ] as string) ?? ""
                }
                onChange={(e) =>
                  setMedicalHistory({
                    ...medicalHistory,
                    [field.key]: e.target.value,
                  })
                }
              />
            </div>
          ))}
        </div>

        <div className={styles.buttonSection}>
          <button>Spara</button>
          <button onClick={onClose}>Avbryt</button>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryModal;
