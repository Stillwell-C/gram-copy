import { useEffect, useRef, useState } from "react";
import logo from "../../assets/Instagram_logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../features/auth/authApiSlice";
import { setCredentials } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { FadeLoader } from "react-spinners";

const LoginForm = () => {
  const errRef = useRef();

  const [loginSuccess, setLoginSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [emailClick, setEmailClick] = useState(false);
  const [emailClass, setEmailClass] = useState("form-input-div");
  const [password, setPassword] = useState("");
  const [passwordClick, setPasswordClick] = useState(false);
  const [passwordClass, setPasswordClass] = useState("form-input-div");
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading, error: errData, isSuccess, isError }] =
    useLoginMutation();

  const dispatch = useDispatch();

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
    const loginResponse = await login({ userIdentifier: email, password });
    if (loginResponse?.data?.accessToken) {
      dispatch(setCredentials({ accessToken: loginResponse.data.accessToken }));
      localStorage.setItem("persistLogin", JSON.stringify(true));
      setLoginSuccess(true);
    }
  };

  useEffect(() => {
    if (loginSuccess) {
      setEmail("");
      setPassword("");
      navigate("/");
    }
  }, [loginSuccess]);

  useEffect(() => {
    if (isError) {
      errRef.current.focus();
    }
  }, [isError]);

  return (
    <>
      <div className='login-top'>
        <img src={logo} alt='instagram logo' className='login-logo' />
        <div className={isError ? "error-div" : "offscreen"}>
          <div className='error-msg' aria-live='assertive' ref={errRef}>
            {errData?.data?.message}
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
          {isLoading ? (
            <div className='loading-spinner-div'>
              <FadeLoader cssOverride={{ scale: "0.7" }} color='#333' />
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
