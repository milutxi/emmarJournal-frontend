import { MedicalHistoryType } from "../types";

export type MedicalHistoryField = {
  key: keyof MedicalHistoryType;
  label: string;
  detailKey?: keyof MedicalHistoryType;
  detailPlaceholder?: string;
};

export type MedicalHistoryFieldGroup = {
  title: string;
  fields: MedicalHistoryField[];
};

export type MedicalHistoryTextField = {
  key: keyof MedicalHistoryType;
  label: string;
}

export const medicalHistoryBooleanGroups: MedicalHistoryFieldGroup[] = [
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

export const medicalHistoryTextFields: MedicalHistoryTextField[] = [
  {
    key: "otherConditions",
    label: "Övriga medicinska tillstånd",
  },
  {
    key: "mhnotes",
    label: "Anteckningar",
  },
];