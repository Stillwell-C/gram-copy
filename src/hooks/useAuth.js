import jwtDecode from "jwt-decode";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isAdmin = false;

  if (token) {
    const decodedToken = jwtDecode(token);
    console.log(decodedToken);
    const { username, id, img, roles, fullname } = decodedToken.UserInfo;
    isAdmin = roles?.some((role) => role.match(/admin/i));

    return { username, id, img, isAdmin, fullname, authenticatedUser: true };
  }

  return {
    username: "",
    id: "",
    img: "",
    fullname: "",
    isAdmin,
    authenticatedUser: false,
  };
};

export default useAuth;
