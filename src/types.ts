export type ActionData = {message: string} | undefined;

export interface Client {
    _id: string;
    name: string;
    lastName: string;
    telephone: number;
    email: string;
    dateOfBirth: Date;
}

export interface Machine {
    _id: string;
    mName: string;
    mManufactureCompany: string;
    mManufactureYear: Date;
    mModelNumber: string;
    mSerialNumber: string;
    mDescription: string;
    mComments: string;
    mStartLeasingDate: Date;
    mFinishLeasingDate: Date;
    mPurchaseDate: Date;
    mServiceLokalDate: Date;
    mServiceManufactureDate: Date;
}