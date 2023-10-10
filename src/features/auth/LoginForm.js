import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";

import { login } from "./authApiRoutes";
import FadeLoaderStyled from "../../components/FadeLoaderStyled";

import "../../scss/login.scss";

import logo from "../../assets/Instagram_logo.png";

const LoginForm = () => {
  const errRef = useRef();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [emailClick, setEmailClick] = useState(false);
  const [emailClass, setEmailClass] = useState("form-input-div");
  const [password, setPassword] = useState("");
  const [passwordClick, setPasswordClick] = useState(false);
  const [passwordClass, setPasswordClass] = useState("form-input-div");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      setEmail("");
      setPassword("");
      navigate("/");
    },
  });

  useEffect(() => {
    const active = email.length ? "active" : "";
    const click = emailClick ? "clicked" : "";
    setEmailClass(`form-input-div ${active} ${click}`);
  }, [email, emailClick]);

  useEffect(() => {
    const active = password.length ? "active" : "";
    const click = passwordClick ? "clicked" : "";
    setPasswordClass(`form-input-div ${active} ${click}`);
  }, [password, passwordClick]);

  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    signInUser();
  };

  const signInUser = async () => {
    loginMutation.mutate({ userIdentifier: email, password });
  };

  useEffect(() => {
    if (loginMutation.isSuccess) {
      setEmail("");
      setPassword("");
      navigate("/");
    }
  }, [loginMutation.isSuccess]);

  useEffect(() => {
    if (location?.state?.errorMessage) {
      errRef.current.focus();
    }
  }, [location?.state?.errorMessage]);

  return (
    <div className='login-container'>
      <div className='login-top'>
        <img
          src={logo}
          alt='instagram logo'
          className='login-logo themeable-icon'
        />
        <div
          className={
            loginMutation.isError || location?.state?.errorMessage
              ? "error-div"
              : "offscreen"
          }
        >
          <div className='error-msg' aria-live='assertive' ref={errRef}>
            {loginMutation?.error?.response?.data?.message}
            {!loginMutation.isError && location?.state?.errorMessage}
          </div>
        </div>
        <form className='login-form' onSubmit={handleSignIn}>
          <div className={emailClass}>
            <label htmlFor='email'>
              <span className='label-text'>Email or Username</span>
              <input
                type='text'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete='off'
                name='email'
                aria-label='email'
                onFocus={() => setEmailClick(true)}
                onBlur={() => setEmailClick(false)}
              />
            </label>
          </div>
          <div className={passwordClass}>
            <label htmlFor='password'>
              <span className='label-text'>Password</span>
              <input
                type={showPassword ? "text" : "password"}
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete='off'
                name='password'
                aria-label='password'
                onFocus={() => setPasswordClick(true)}
                onBlur={() => setPasswordClick(false)}
              />
            </label>
            <div className='input-side-div'>
              <button
                className='input-side-button'
                type='button'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {loginMutation.isLoading ? (
            <div className='loading-spinner-div'>
              <FadeLoaderStyled />
            </div>
          ) : (
            <button
              type='submit'
              className='submit-button blue-button standard-button'
            >
              Log in
            </button>
          )}
        </form>
        <div className='or-div'>
          <div className='line'> </div>
          <div className='or-lettering'>or</div>
          <div className='line'> </div>
        </div>
        <div className='login-google'>Log in with Google</div>
        <div className='forgot-password'>Forgot password?</div>
      </div>
      <div className='login-bottom'>
        <p>
          Don't have an account? <Link to='/accounts/emailsignup'>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
