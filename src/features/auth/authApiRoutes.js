import gramCopyApi from "../../app/api/gramCopyApi";
import { store } from "../../app/store";
import { logOut, setCredentials } from "./authSlice";

export const refresh = async () => {
  const response = await gramCopyApi.get(`/auth/refresh`);

  const { accessToken } = response.data;
  store.dispatch(setCredentials({ accessToken }));

  return response;
};

export const logout = async () => {
  try {
    await gramCopyApi.post("/auth/logout");
    //Extra assurance that loggedIn cookie is cleared
    document.cookie = "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    store.dispatch(logOut());
    window.location.reload();
  } catch (err) {
    console.log(err);
    window.location.reload();
  }
};
