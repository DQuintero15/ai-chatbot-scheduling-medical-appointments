import { AxiosInstance } from "axios";

export class AppointmentService {
  constructor(private axios: AxiosInstance) {}

  async getUserAppointments(phoneNumber: string) {
    const response = await this.axios.get<Array<Appointment>>(
      `/api/appointments/patient/${phoneNumber}`
    );

    return response.data;
  }
}
