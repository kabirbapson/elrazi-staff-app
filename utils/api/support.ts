// /api/support.ts
import { http } from "./config";
import { getAuthHeader } from "./helpers";

export const getAllTickets = async () =>
  http.get("/api/tickets/", await getAuthHeader());

export const getTicketById = async (ticketId: string) =>
  http.get(`/api/tickets/${ticketId}/`, await getAuthHeader());

export const postTicketMessage = async (ticketId: string, content: string) =>
  http.post(`/api/tickets/${ticketId}/messages/`, { content }, await getAuthHeader());

export const updateTicket = async (ticketId: string, payload: any) =>
  http.put(`/api/tickets/${ticketId}/`, payload, await getAuthHeader());
