import gramCopyApi from "../../app/api/gramCopyApi";
import { store } from "../../app/store";
import { setCredentials } from "./authSlice";

export const refresh = async () => {
  const response = await gramCopyApi.get(`/auth/refresh`);

  const { accessToken } = response.data;
  store.dispatch(setCredentials({ accessToken }));

  return response;
};
