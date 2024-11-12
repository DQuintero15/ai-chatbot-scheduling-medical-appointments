import { AxiosInstance } from "axios";
import { Patient } from "src/typings/patients";

export class PatientsService {
    constructor(private axios: AxiosInstance) {}
    
    async getPatientByDocument(document: string) {
        const response = await this.axios.get<Patient | null>(`/api/patients/${document}`);
        return response.data;
    }
}