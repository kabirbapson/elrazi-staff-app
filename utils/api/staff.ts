// /api/staff.ts
import { http } from "./config";
import { getAuthHeader } from "./helpers";

export const getAllTeachers = async () =>
  http.get("/api/manage/staff/", await getAuthHeader());

export const createStaff = async (payload: any) =>
  http.post("/api/manage/staff/", payload, await getAuthHeader());

export const getTeacherById = async (teacherId: string) =>
  http.get(`/api/manage/staff/${teacherId}/`, await getAuthHeader());

export const updateStaff = async (teacherId: string, payload: any) =>
  http.put(`/api/manage/staff/${teacherId}/`, payload, await getAuthHeader());

export const deleteStaff = async (teacherId: string) =>
  http.delete(`/api/manage/staff/${teacherId}/`, await getAuthHeader());

export const addSubjectToTeacher = async (teacherId: string, subjectId: string) =>
  http.post(`/api/teachers/${teacherId}/add-subject/${subjectId}/`, {}, await getAuthHeader());
