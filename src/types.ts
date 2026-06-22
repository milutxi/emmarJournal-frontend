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
  clientId: string;
  treatmentIds: string[];
  machineIds: string[];
  jDate: string;
  price: number;
  discount?: number;
  totalPrice: number;
  notes?: string;
  medicalHistoryReviewed: boolean;
  consentConfirmed: boolean;
  signedAt: string;
}

export interface TreatmentSession {
  treatmentId: string;
  machineIds: string[];
  treatmentParameters?: TreatmentParametersType;
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

