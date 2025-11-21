
// /api/helpers.ts
import * as SecureStore from "expo-secure-store";

export const loadUserSession = async () => {
  const sessionStr = await SecureStore.getItemAsync("session");
  return sessionStr ? JSON.parse(sessionStr) : {};
};

export const getAuthHeader = async () => {
  const session = await loadUserSession();
  if (!session.token) return;
  return { headers: { Authorization: `Token ${session.token}` } };
};
