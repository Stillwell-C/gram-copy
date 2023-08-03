import { useState, useEffect } from "react";

const usePersistentLogin = () => {
  const [persistentLogin, setPersistentLogin] = useState(
    JSON.parse(localStorage.getItem("persistLogin")) || false
  );

  useEffect(() => {
    localStorage.setItem("persistLogin", JSON.stringify(persistentLogin));
  }, [persistentLogin]);
  return [persistentLogin, setPersistentLogin];
};

export default usePersistentLogin;
