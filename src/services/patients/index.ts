import { AxiosInstance } from "axios";
import { Patient } from "src/typings/patients";

export class PatientsService {
    constructor(private axios: AxiosInstance) {}
    
    async getPatientByDocument(document: string) {
        const response = await this.axios.get<Patient | null>(`/api/patients/${document}`);
        return response.data;
    }

    async isPatientDataPolicyConfirmed(phoneNumber: string) {
        console.log(`[DEBUG]: phoneNumber`, phoneNumber);
        const response = await this.axios.get<boolean>(`/api/patients/data-policy/${phoneNumber}`);
        return response.data;
    }
}