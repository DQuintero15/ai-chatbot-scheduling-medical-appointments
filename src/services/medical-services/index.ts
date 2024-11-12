import { AxiosInstance } from "axios";
import { ServicesResponse } from "src/typings/medical-services";

export class MedicalService {
    constructor(private axios: AxiosInstance) {}

    async getServices() {
        const response = await this.axios.get<ServicesResponse>("/api/services");
        return response.data;
    }
}