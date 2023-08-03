import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/authContext";
import logo from "../../assets/Instagram_logo.png";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";
import { useLoginMutation } from "../../features/auth/authApiSlice";
import usePersistentLogin from "../../hooks/usePersistentLogin";
import { setCredentials } from "../../features/auth/authSlice";

const LoginForm = () => {
  const errRef = useRef();

  // const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [email, setEmail] = useState("");
  const [emailClick, setEmailClick] = useState(false);
  const [emailClass, setEmailClass] = useState("form-input-div");
  const [password, setPassword] = useState("");
  const [passwordClick, setPasswordClick] = useState(false);
  const [passwordClass, setPasswordClass] = useState("form-input-div");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [persistentLogin, setPersistentLogin] = usePersistentLogin();

  const [login, { isLoading, error, isSuccess, isError }] = useLoginMutation();

  const { dispatch } = useContext(AuthContext);

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
    setLoading(true);
    setErrorMsg("");
    setPersistentLogin(true);
    const loginResponse = await login({ userIdentifier: email, password });
    dispatch(setCredentials({ accessToken: loginResponse.data.accessToken }));
  };

  useEffect(() => {
    if (isSuccess) {
      setEmail("");
      setPassword("");
      navigate("/");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      errRef.current.focus();
    }
  }, [isError]);

  return (
    <>
      <div className='login-top'>
        <img src={logo} alt='instagram logo' className='login-logo' />
        {isError && (
          <div className='error-div'>
            <div className='error-msg' aria-live='assertive' ref={errRef}>
              {error?.data?.message}
            </div>
          </div>
        )}
        <form className='login-form' onSubmit={handleSignIn}>
          <div className={emailClass}>
            <label aria-label='email' htmlFor='email'>
              <span className='label-text'>Email</span>
              <input
                type='email'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete='off'
                name='email'
                onFocus={() => setEmailClick(true)}
                onBlur={() => setEmailClick(false)}
              />
            </label>
          </div>
          <div className={passwordClass}>
            <label aria-label='password' htmlFor='password'>
              <span className='label-text'>Password</span>
              <input
                type={showPassword ? "text" : "password"}
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete='off'
                name='password'
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
          {isLoading ? (
            <div className='loading-spinner-div'>
              <LoadingSpinner />
            </div>
          ) : (
            <button type='submit' className='submit-button'>
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
    </>
  );
};

export default LoginForm;
