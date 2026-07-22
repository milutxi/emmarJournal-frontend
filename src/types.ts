export type ActionData = {
  success?: boolean;
  message?: string;
};

export interface Client {
  _id: string;
  name: string;
  lastName: string;
  telephone: string;
  email: string;
  dateOfBirth: string;
}

export interface Machine {
  _id: string;
  mName: string;
  mManufactureCompany: string;
  mManufactureYear: string;
  mModelNumber: string;
  mSerialNumber: string;
  mDescription: string;
  mComments: string;
  mStartLeasingDate: string;
  mFinishLeasingDate: string;
  mPurchaseDate: string;
  mServiceLokalDate: string;
  mServiceManufactureDate: string;
  mCommentsLokalService: string;
  mCommentsManufactureService: string;
  mServiceLokalNextDate: string;
  mServiceManufactureNextDate: string;
  requiresTreatmentParameters: boolean;
  acquisitionType: "leasing" | "purchase";
  setupMenu?: MachineSetupNode[];
  parameterDefinitions?: MachineParameterDefinition[];
}

export interface CreateMachineForm {
  mName: string;
  mManufactureCompany: string;
  mManufactureYear: string;
  mModelNumber: string;
  mSerialNumber: string;
  mDescription: string;
  mComments: string;
  mStartLeasingDate: string;
  mFinishLeasingDate: string;
  mPurchaseDate: string;
  mServiceLokalDate: string;
  mServiceManufactureDate: string;
  mCommentsLokalService: string;
  mCommentsManufactureService: string;
  mServiceLokalNextDate: string;
  mServiceManufactureNextDate: string;
  requiresTreatmentParameters: boolean;
  acquisitionType: "leasing" | "purchase";
  setupMenu: MachineSetupNode[];
  parameterDefinitions: MachineParameterDefinition[];
}

export interface MachineSetupNode {
  _id?: string;
  label: string;
  children?: MachineSetupNode[];
}

//used when creating the machine
export interface MachineParameterDefinition {
  _id?: string;
  label: string;
  unit?: string;
}

//used when adding value in the session
export interface MachineParameterValue {
  label: string;
  unit?: string;
  value: string;
}

export interface MachineSetting {
  machineId: string | Machine;
  setupPath: string[];
  parameters: MachineParameterValue[];
  comment: string;
}

export interface Treatment {
  _id: string;
  tname: string;
  tdescription: string;
  tduration: number;
  tprice: number;
}

export interface Journal {
  _id: string;
  clientId: string | Client | null;

  treatments: Array<
    Omit<
      TreatmentSession,
      "treatmentId" | "machineIds" | "treatmentParameters"
    > & {
      treatmentId: string | Treatment;
      machineIds: Array<string | Machine>;
      treatmentParametersId?:
        | string
        | (TreatmentParametersType & { _id: string });
    }
  >;

  medicalHistoryId:
    | string
    | (MedicalHistoryType & {
        _id: string;
        version?: number;
        isLatest?: boolean;
        signedAt?: string;
        signatureImage?: string;
      });

  consentFormId: string | ConsentFormType;

  jDate: string;

  area?: string;
  fitzpatrickType?: number;

  medicalHistoryReviewed: boolean;
  consentConfirmed: boolean;

  changesReported?: boolean;
  changesDescription?: string;

  beforePhotos?: string[];
  afterPhotos?: string[];

  performedBy?: string;
  signedAt?: string;

  createdAt: string;
  updatedAt: string;
}

export interface TreatmentSession {
  treatmentId: string;
  machineIds: string[];
  treatmentParameters?: TreatmentParametersType;
  machineSettings?: MachineSetting[];
  duration: number;
  price: number;
  discount: number;
  totalPrice: number;
  notes: string;
}

export interface TreatmentParametersType {
  wavelength?: string;
  pulseMode?: string;
  energyDensity?: string;
  pulseEnergy?: string;
  spotSize?: string;
  frequency?: string;
  pulseDuration?: string;
  coolingUsed?: boolean;
  tpComment?: string;
}

export interface MedicalHistoryType {
  pregnant?: boolean;
  breastfeeding?: boolean;
  diabetic?: boolean;
  skinInfection?: boolean;
  autoimmuneDisease?: boolean;
  epilepsy?: boolean;
  pacemaker?: boolean;
  cancer?: boolean;
  hepatitis?: boolean;
  tattoos?: boolean;
  permanentFillers?: boolean;
  hypersensitiveSkin?: boolean;
  skinDiseases?: boolean;
  heartProblems?: boolean;
  venerealDiseases?: boolean;
  hormonalChanges?: boolean;
  medication?: boolean;
  medicationDetails?: string;
  omega3?: boolean;
  allergies?: boolean;
  allergyDetails?: string;
  anesthesiaReaction?: boolean;
  anesthesiaReactionDetails?: string;
  anaphylaxis?: boolean;
  anaphylaxisDetails?: string;
  bloodThinners?: boolean;
  bloodThinnerDetails?: string;
  hypertrophicScarring?: boolean;
  hypertrophicScarringDetails?: string;

  otherConditions?: string;
  mhnotes?: string;
  consentAccepted?: boolean;
  signedAt?: string;
  signatureImage?: string;
}

export interface ConsentFormType {
  _id?: string;
  treatmentIds: string[];
  consentText: string;
  accepted: boolean;
  signatureImage: string;
  signedAt?: string;
}
