import axios from "axios";
import { store } from "../store";

const gramCopyApi = axios.create({
  baseURL: "http://localhost:3500",
  withCredentials: true,
});

gramCopyApi.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.token;
  if (token !== null) {
    config.headers["authorization"] = `Bearer ${token}`;
  }

  return config;
});

export default gramCopyApi;
