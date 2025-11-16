// /api/config.ts
import { API_BASE_URL } from '@env';
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// ---- Token Refresh Handling ----
let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];

function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshQueue.push(callback);
}

function onRefreshed(newToken: string) {
  refreshQueue.forEach((cb) => cb(newToken));
  refreshQueue = [];
}

async function logout() {
  await SecureStore.deleteItemAsync("session");
  Toast.show({
    type: "info",
    text1: "Session expired",
    text2: "Please log in again.",
  });
}

// Attach access token to requests
http.interceptors.request.use(async (config) => {
  const sessionStr = await SecureStore.getItemAsync("session");
  const session = sessionStr ? JSON.parse(sessionStr) : null;
  if (session?.accessToken) {
    config.headers.Authorization = `Token ${session.accessToken}`;
  }
  return config;
});


// Response interceptor with refresh logic
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const sessionStr = await SecureStore.getItemAsync("session");
      const session = sessionStr ? JSON.parse(sessionStr) : null;

      if (!session?.refreshToken) {
        await logout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            originalRequest.headers.Authorization = `Token ${newToken}`;
            resolve(http(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`,
          { refreshToken: session.refreshToken }
        );

        const { accessToken, refreshToken } = refreshResponse.data;

        await SecureStore.setItemAsync(
          "session",
          JSON.stringify({ accessToken, refreshToken })
        );

        onRefreshed(accessToken);
        originalRequest.headers.Authorization = `Token ${accessToken}`;
        return http(originalRequest);
      } catch {
        await logout();
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
