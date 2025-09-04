export interface Patient {
  id: string;
  name: string;
  email: string;
  photo_url: string | null;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  photo_url: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  specialization?: string;
  photo_url?: string | null;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
  patient?: Patient;
  doctor?: Doctor;
  time?: string;
}

export type AppointmentStatus = "PENDING" | "COMPLETED" | "CANCELLED";
export type UserRole = "PATIENT" | "DOCTOR";