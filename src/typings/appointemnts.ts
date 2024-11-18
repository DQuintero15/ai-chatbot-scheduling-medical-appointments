interface Appointment {
  id: number;
  doctor: Doctor;
  service: Service;
  appointmentTime: string;
  status: string;
  createdAt: string | null;
  updatedAt: string | null;
}

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  phoneNumber: string;
  status: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

interface Service {
  id: number;
  name: string;
  description: string;
  createdAt: string | null;
  updatedAt: string | null;
}
