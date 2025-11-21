// /api/app.ts
import { http } from "./config";
import { getAuthHeader } from "./helpers";

export const getPendingStudent = async () =>
  http.get("/api/students/admissions/management/", await getAuthHeader());

export const getStudents = async () =>
  http.get("/api/students/management/?limit=20", await getAuthHeader());

export const getCourses = async () =>
  http.get("/api/faculty-courses/", await getAuthHeader());

export const changeAdmissionStatus = async (payload: any) =>
  http.put("/api/students/admissions/management/", payload, await getAuthHeader());

export const createStudentProfile = async (payload: any) =>
  http.post("/api/students/profile", payload, await getAuthHeader());

export const createPayment = async (payload: any) =>
  http.post("/api/admin/payments/", payload, await getAuthHeader());

export const updatePayment = async (paymentId: string, payload: any) =>
  http.patch(`/api/admin/payments/${paymentId}/`, payload, await getAuthHeader());

export const removePayment = async (paymentId: string) =>
  http.delete(`/api/admin/payments/${paymentId}/`, await getAuthHeader());
