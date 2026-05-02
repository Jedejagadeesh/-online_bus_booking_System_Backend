import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",   // ✅ ADD /api
});

export const searchBuses = (from, to) =>
  api.get(`/search/?from=${from}&to=${to}`);

export const getBookedSeats = (busId, date) =>
  api.get(`/booked/${busId}/?date=${date}`);

export const bookSeats = (data) =>
  api.post(`/book/`, data);

export default api;