import { http } from './config';

export const loginUser = async (payload) => http.post('/api/auth/staff/login', payload);

export const registerUser = (payload) => http.post('/register/', payload);
