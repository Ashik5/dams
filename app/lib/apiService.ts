import api from './api';
import { AppointmentStatus, LoginPayload, LoginResponseData } from '../types';

// ====================================================================
// AUTH
// ====================================================================
export const loginUser = async (data: LoginPayload) => {
  const response = await api.post('/auth/login', data);
  return response;
};
export const registerPatient = async (data: any) => {
  const response = await api.post('/auth/register/patient', data);
  return response.data;
};
export const registerDoctor = async (data: any) => {
  const response = await api.post('/auth/register/doctor', data);
  return response.data;
};
export const logoutUser = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};
export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

// ====================================================================
// APPOINTMENTS
// ====================================================================
export const getDoctorAppointments = async (params: any) => {
  const response = await api.get('/appointments/doctor', { params });
  return response.data;
};
export const getPatientAppointments = async (params: any) => {
  const response = await api.get('/appointments/patient', { params });
  return response.data;
};
export const createAppointment = async (data: { doctorId: string; date: string }) => {
  const response = await api.post('/appointments', data);
  return response.data;
};
export const updateAppointmentStatus = async (data: { appointment_id: string; status: AppointmentStatus }) => {
  const response = await api.patch('/appointments/update-status', data);
  return response.data;
};

// ====================================================================
// DOCTORS
// ====================================================================
export const getDoctors = async (params: any) => {
  const response = await api.get('/doctors', { params });
  return response.data;
};

// ====================================================================
// SPECIALIZATIONS
// ====================================================================
export const getSpecializations = async () => {
  const response = await api.get('/specializations');
  const data = response.data;
  return Array.isArray(data) ? data : data.data || [];
};