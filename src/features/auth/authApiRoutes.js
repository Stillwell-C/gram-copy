import gramCopyApi from "../../app/api/gramCopyApi";
import { store } from "../../app/store";
import { setCredentials } from "./authSlice";

export const refresh = async () => {
  try {
    const response = await gramCopyApi.get(`/auth/refresh`);

    const { accessToken } = response.data;
    store.dispatch(setCredentials({ accessToken }));

    return response;
  } catch (err) {
    console.log(err);
  }
};
