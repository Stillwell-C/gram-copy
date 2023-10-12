import axios from "axios";
import { store } from "../store";
import { refresh } from "../../features/auth/authApiRoutes";

const gramCopyApi = axios.create({
  baseURL: "https://gram-copy-api-production.up.railway.app",
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

gramCopyApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    //If 403 comes from /auth/refresh route, user has been confirmed to not be authenticated
    if (
      error?.response?.status === 403 &&
      error?.response?.config?.url !== "/auth/refresh"
    ) {
      const refreshResult = await refresh();
      if (refreshResult?.data?.accessToken) {
        return gramCopyApi.request(error.config);
      }
      if (!refreshResult) {
        return (window.location.href = "/accounts/error");
      }
    }

    return Promise.reject(error);
  }
);

export default gramCopyApi;
