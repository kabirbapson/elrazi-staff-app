// /api/user.ts
import { http } from "./config";
import { getAuthHeader } from "./helpers";

export const getUserDetail = async () =>
  http.get("/api/auth/user/", await getAuthHeader());

export const createUser = async (payload: any) =>
  http.post("/api/users/", payload, await getAuthHeader());

export const handleCompleteBulkAction = async (payload: any) =>
  http.post("/api/students/bulk-action", payload, await getAuthHeader());
