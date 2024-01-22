export type ActionData = {message: string} | undefined;

export interface Client {
    _id: string;
    name: string;
    lastName: string;
    telephone: number;
    email: string;
    dateOfBirth: Date;
}