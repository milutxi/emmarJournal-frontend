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
  acquisitionType: "leasing" | "purchase";
}