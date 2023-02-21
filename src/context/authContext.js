import { onAuthStateChanged } from "firebase/auth";
import { createContext, useReducer, useEffect, useState } from "react";
import { auth } from "../firebase";

// import AuthReducer from "./authReducer";

// const INITIAL_STATE = {
//   currentUser: JSON.parse(localStorage.getItem("user")) || null,
// };

// export const AuthContext = createContext(INITIAL_STATE);

// export const AuthContextProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

//   //TODO: make an expiry method for local storage items
//   useEffect(() => {
//     localStorage.setItem("user", JSON.stringify(state.currentUser));
//   }, [state.currentUser]);

//   return (
//     <AuthContext.Provider value={{ currentUser: state.currentUser, dispatch }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
