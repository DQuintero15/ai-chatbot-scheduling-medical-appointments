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

interface Schedule {
  id: number;
  doctor: Doctor;
  startTime: string;
  endTime: string;
  scheduleDate: string;
  createdAt: string | null;
  updatedAt: string | null;
}

type SchedulesResponse = Schedule[];
