import styles from "./medicalHistoryModal.module.scss";

//import { useState } from "react";
import { MedicalHistoryType } from "../../types";

type Props = {
  isOpen: boolean;
  onClose: () => void;

  medicalHistory: MedicalHistoryType;
  setMedicalHistory: React.Dispatch<React.SetStateAction<MedicalHistoryType>>;
  setMedicalHistoryCompleted: React.Dispatch<React.SetStateAction<boolean>>;
};

const MedicalHistoryModal = ({ onClose, isOpen,  medicalHistory, setMedicalHistory, setMedicalHistoryCompleted }: Props) => {
  // const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryType>({
  //   pregnant: false,
  // });

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
        {
          key: "bloodThinners",
          label: "Blodförtunnande medicin",
          detailKey: "bloodThinnerDetails",
          detailPlaceholder: "Beskriv blodförtunnande behandling",
        },
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
        {
          key: "hypertrophicScarring",
          label: "Hypertrofisk ärrbildning",
          detailKey: "hypertrophicScarringDetails",
          detailPlaceholder: "Beskriv hypertrofisk ärrbildning",
        },
      ],
    },
    {
      title: "Läkemedel & Reaktioner",
      fields: [
        {
          key: "medication",
          label: "Äter receptbelagd medicin",
          detailKey: "medicationDetails",
          detailPlaceholder: "Beskriv medicinering",
        },
        {
          key: "allergies",
          label: "Allergier",
          detailKey: "allergyDetails",
          detailPlaceholder: "Beskriv allergier",
        },
        {
          key: "anaphylaxis",
          label: "Anafylaktisk chock",
          detailKey: "anaphylaxisDetails",
          detailPlaceholder: "Beskriv anafylaxi",
        },
        {
          key: "anesthesiaReaction",
          label: "Biverkningar av lokalbedövning",
          detailKey: "anesthesiaReactionDetails",
          detailPlaceholder: "Beskriv reaktion på anestesi",
        },
      ],
    },
  ];

  // const detailFields = [
  //   {
  //     booleanKey: "medication",
  //     detailKey: "medicationDetails",
  //     label: "Beskriv medicinering",
  //   },
  //   {
  //     booleanKey: "allergies",
  //     detailKey: "allergyDetails",
  //     label: "Beskriv allergier",
  //   },
  //   {
  //     booleanKey: "anesthesiaReaction",
  //     detailKey: "anesthesiaReactionDetails",
  //     label: "Beskriv reaktion på anestesi",
  //   },
  //   {
  //     booleanKey: "anaphylaxis",
  //     detailKey: "anaphylaxisDetails",
  //     label: "Beskriv anafylaxi",
  //   },
  //   {
  //     booleanKey: "bloodThinners",
  //     detailKey: "bloodThinnerDetails",
  //     label: "Beskriv blodförtunnande behandling",
  //   },
  //   {
  //     booleanKey: "hypertrophicScarring",
  //     detailKey: "hypertrophicScarringDetails",
  //     label: "Beskriv hypertrofisk ärrbildning",
  //   },
  // ];

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

  const handleSaveMedicalHistory = () => {
    setMedicalHistoryCompleted(true);
    onClose();
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <button className={styles.closeButton} onClick={onClose}>
            X
          </button>
          <h2 className={styles.title}>Medicinsk Hälsodeklaration</h2>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.booleanSection}>
            {booleanGroups.map((group) => (
              <div key={group.title} className={styles.group}>
                <h3>{group.title}</h3>

                {group.fields.map((field) => (
                  <div key={field.key} className={styles.field}>
                    <label className={styles.checkboxLabel}>
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

                    {field.detailKey &&
                      medicalHistory[field.key as keyof MedicalHistoryType] && (
                        <div className={styles.detailField}>
                          <textarea
                            placeholder={field.detailPlaceholder}
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
                            rows={2}
                          />
                        </div>
                      )}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className={styles.detailSection}>
            {/* {detailFields.map((field) => {
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
          })} */}
          </div>
          <div className={styles.textSection}>
            {textFields.map((field) => (
              <div key={field.key}>
                <label>{field.label}</label>
                <textarea
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
            <button className={styles.cancelButton} onClick={onClose}>
              Avbryt
            </button>
            <button className={styles.saveButton} onClick={handleSaveMedicalHistory}>Spara</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryModal;
