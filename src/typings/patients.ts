export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  phoneNumber: string;
  documentIdentification: string;
  identificationType: string;
  confirmDataPolicy: boolean;
  confirmTermsConditionsDate: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}
