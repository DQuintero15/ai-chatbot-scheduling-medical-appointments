import { AxiosInstance } from "axios";

export class ScheduleService {
    
    constructor(private axios: AxiosInstance) {}

    async getSchedulesAvailablesBySpecialtyID(specialtyID: number) {
        const response = await this.axios.get<SchedulesResponse>(`api/schedules/by-speciality/${specialtyID}`);
        return response.data;
    } 
}