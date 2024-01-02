import React, { useEffect } from "react";
import { login } from "./authApiRoutes";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setError, setErrorRefreshPage } from "../error/errorSlice";

const LoginTestUserButton = ({ classname }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      navigate("/");
    },
    onError: () => {
      dispatch(setError(true));
      dispatch(setErrorRefreshPage(true));
    },
  });

  const handleSignIn = (e) => {
    e.preventDefault();
    const usersArr = ["testUser2", "testUser3", "testUser4", "testUser5"];
    const randomUser = usersArr[Math.floor(usersArr.length * Math.random())];
    signInUser(randomUser);
  };

  const signInUser = async (username) => {
    loginMutation.mutate({ userIdentifier: username, password: "testuser1" });
  };

  return (
    <button className={classname} onClick={handleSignIn}>
      Try Test Account
    </button>
  );
};

export default LoginTestUserButton;
