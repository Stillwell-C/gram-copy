import { useEffect, useRef, useState } from "react";
import logo from "../../assets/Instagram_logo.png";
import { Link } from "react-router-dom";
import errorIcon from "../../assets/error-warning-danger-problem-attention-svgrepo-com.svg";
import successIcon from "../../assets/check-circle-svgrepo-com.svg";
import { FadeLoader } from "react-spinners";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  createUser,
  getEmailAvailability,
  getUsernameAvailability,
} from "../../features/users/usersApiRoutes";

//Begin with upper/lower case letter and contain 3-23 more characters
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
//Min 8 char long. Must contain at least one letter & one number
const PWD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,24}$/;
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const SignupForm = () => {
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [email, setEmail] = useState("");
  const [emailCheck, setEmailCheck] = useState(false);
  const [emailClick, setEmailClick] = useState(false);
  const [emailClass, setEmailClass] = useState("form-input-div");
  const [emailSuccess, setEmailSuccess] = useState(null);

  const [fullname, setFullname] = useState("");
  const [fullnameClass, setFullnameClass] = useState("form-input-div");
  const [fullnameClick, setFullnameClick] = useState(false);
  const [fullnameSuccess, setFullnameSuccess] = useState(null);

  const [username, setUsername] = useState("");
  const [usernameClick, setUsernameClick] = useState(false);
  const [usernameClass, setUsernameClass] = useState("form-input-div");
  const [usernameSuccess, setUsernameSuccess] = useState(null);
  const [usernameCheck, setUsernameCheck] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordClick, setPasswordClick] = useState(false);
  const [passwordClass, setPasswordClass] = useState("form-input-div");
  const [passwordSuccess, setPasswordSuccess] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const errRef = useRef();

  //EMAIL FUNCTIONS
  const { data: emailCheckData, isError: emailCheckIsError } = useQuery(
    ["emailCheck", email],
    () =>
      getEmailAvailability(email)
        .then(setEmailCheck(false))
        .catch(setEmailCheck(false)),
    {
      enabled: emailCheck,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (!EMAIL_REGEX.test(email)) setEmailSuccess(false);
    const active = email.length ? "active" : "";
    const click = emailClick ? "clicked" : "";
    const icon = emailClick ? "" : emailSuccess !== null ? "display-icon" : "";
    setEmailClass(`form-input-div ${active} ${click} ${icon}`);
  }, [email, emailClick, emailSuccess]);

  useEffect(() => {
    if (emailCheckData?.availability && EMAIL_REGEX.test(email)) {
      setEmailSuccess(true);
      return;
    }
    setEmailSuccess(false);
  }, [emailCheckData]);

  const handleEmailCheck = () => {
    setEmailClick(false);
    setEmailCheck(true);
  };

  //FULLNAME FUNCTIONS
  useEffect(() => {
    fullname.length > 2 && fullname.length < 30
      ? setFullnameSuccess(true)
      : setFullnameSuccess(false);

    const active = fullname.length ? "active" : "";
    const click = fullnameClick ? "clicked" : "";
    const icon = fullnameClick
      ? ""
      : fullnameSuccess !== null
      ? "display-icon"
      : "";
    setFullnameClass(`form-input-div ${active} ${click} ${icon}`);
  }, [fullname, fullnameClick, fullnameSuccess]);

  //USERNAME FUNCTIONS
  const { data: usernameCheckData, isError: usernameCheckIsError } = useQuery(
    ["usernameCheck", username],
    () =>
      getUsernameAvailability(username)
        .then(setUsernameCheck(false))
        .catch(setUsernameCheck(false)),
    {
      enabled: usernameCheck,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (!USER_REGEX.test(username)) setUsernameSuccess(false);
    const active = username.length ? "active" : "";
    const click = usernameClick ? "clicked" : "";
    const icon = usernameClick
      ? ""
      : usernameSuccess !== null
      ? "display-icon"
      : "";
    setUsernameClass(`form-input-div ${active} ${click} ${icon}`);
  }, [username, usernameClick, usernameSuccess]);

  useEffect(() => {
    if (usernameCheckData?.availability && USER_REGEX.test(username)) {
      setUsernameSuccess(true);
      return;
    }
    setUsernameSuccess(false);
  }, [usernameCheckData]);

  const handleUsernameCheck = () => {
    setUsernameClick(false);
    setUsernameCheck(true);
  };

  //PASSWORD FUNCTIONS

  useEffect(() => {
    if (PWD_REGEX.test(password)) setPasswordSuccess(true);
    else setPasswordSuccess(false);
    const active = password.length ? "active" : "";
    const click = passwordClick ? "clicked" : "";
    const icon = passwordClick
      ? ""
      : passwordSuccess !== null
      ? "display-icon"
      : "";
    setPasswordClass(`form-input-div ${active} ${click} ${icon}`);
  }, [password, passwordClick]);

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  const handleCreateUser = (e) => {
    e.preventDefault();
    setError(false);
    setErrorMsg("");
    if (fullname.length < 3 || fullname.length > 30) {
      setError(true);
      setErrorMsg("Name must be 3-30 characters");
      return;
    }
    if (!PWD_REGEX.test(password)) {
      setError(true);
      setErrorMsg("Invalid password");
      return;
    }
    if (!USER_REGEX.test(username)) {
      setError(true);
      setErrorMsg("Invalid username");
      return;
    }
    //email verification will be done server side
    //regex only performs a simple check
    if (!email.length) {
      setError(true);
      setErrorMsg("Email required");
      return;
    }
    if (
      !email.length ||
      !username.length ||
      !fullname.length ||
      !password.length
    ) {
      setError(true);
      setErrorMsg("Please complete all fields");
      setLoading(false);
      return;
    }
    createUserMutation.mutate({ username, password, email, fullname });
  };

  useEffect(() => {
    if (error || createUserMutation.isError) {
      errRef.current.focus();
    }
  }, [error, createUserMutation.isError]);

  const createUserPage = (
    <>
      <div className='login-top'>
        <img src={logo} alt='instagram logo' className='login-logo' />
        <h2 className='sign-up-header'>
          Sign up to see photos and videos from your friends.
        </h2>
        <button className='login-google-button'>Log in with Google</button>
        <div className='or-div'>
          <div className='line'> </div>
          <div className='or-lettering'>or</div>
          <div className='line'> </div>
        </div>
        <div
          className={
            error || createUserMutation.isError ? "error-div" : "offscreen"
          }
        >
          <div className='error-msg' ref={errRef} aria-live='assertive'>
            {errorMsg}
            {createUserMutation?.error?.response?.data?.message}
          </div>
        </div>
        <form className='sign-up-form' onSubmit={handleCreateUser}>
          <div className={emailClass}>
            <label htmlFor='email'>
              <span className='label-text'>Email</span>
              <input
                type='email'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete='off'
                spellCheck='false'
                name='email'
                aria-label='email'
                aria-invalid={emailSuccess ? "false" : "true"}
                onFocus={() => setEmailClick(true)}
                onBlur={handleEmailCheck}
              />
            </label>
            <div className='input-side-div'>
              <img
                className='icon'
                aria-label={emailSuccess ? "check mark icon" : "x icon"}
                src={emailSuccess ? successIcon : errorIcon}
              />
            </div>
          </div>
          <div className={fullnameClass}>
            <label htmlFor='fullname'>
              <span className='label-text'>Full Name</span>
              <input
                type='text'
                id='fullname'
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
                autoComplete='off'
                spellCheck='false'
                name='email'
                onFocus={() => setFullnameClick(true)}
                onBlur={() => setFullnameClick(false)}
                aria-invalid={emailSuccess ? "false" : "true"}
                aria-label='full name'
              />
            </label>
            <div className='input-side-div'>
              <img
                className='icon'
                aria-label={fullnameSuccess ? "check mark icon" : "x icon"}
                src={fullnameSuccess ? successIcon : errorIcon}
              />
            </div>
          </div>
          <div className={usernameClass}>
            <label htmlFor='username'>
              <span className='label-text'>Username</span>
              <input
                type='text'
                id='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete='off'
                spellCheck='false'
                name='username'
                onFocus={() => setUsernameClick(true)}
                onBlur={handleUsernameCheck}
                aria-invalid={usernameSuccess ? "false" : "true"}
                aria-label='username'
                aria-describedby='usernameNote'
              />
            </label>
            <div className='input-side-div'>
              <img
                className='icon'
                aria-label={usernameSuccess ? "check mark icon" : "x icon"}
                src={usernameSuccess ? successIcon : errorIcon}
              />
            </div>
          </div>
          <p
            id='usernameNote'
            className={
              usernameClick && username.length && !usernameSuccess
                ? "form-description"
                : "offscreen"
            }
          >
            4 to 24 characters. <br />
            Must begin with a letter. <br />
            Letters, numbers, underscores, hyphens allowed.
          </p>
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
                onFocus={() => setPasswordClick(true)}
                onBlur={() => setPasswordClick(false)}
                aria-invalid={passwordSuccess ? "false" : "true"}
                aria-label='password'
                aria-describedby='passwordNote'
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
          <p
            id='passwordNote'
            className={
              passwordClick && !passwordSuccess && password.length
                ? "form-description form-fade-in"
                : "offscreen"
            }
          >
            8 to 24 characters. <br />
            Must include at least one letter and one number.
          </p>
          {loading ? (
            <div className='loading-spinner-div'>
              <FadeLoader cssOverride={{ scale: "0.7" }} color='#333' />
            </div>
          ) : (
            <button type='submit' className='submit-button'>
              Sign up
            </button>
          )}
          <span className='signup-error-span'></span>
        </form>
      </div>
      <div className='login-bottom'>
        <p>
          Have an account? <Link to='/accounts/login'>Log in</Link>
        </p>
      </div>
    </>
  );

  const successPage = (
    <div className='login-top success'>
      <img src={logo} alt='instagram logo' className='login-logo' />

      <h1>Success</h1>
      <p>
        Your account has been successfully created. Please follow the link below
        to log in.
      </p>
      <Link to='/accounts/login'>Log in</Link>
    </div>
  );

  return createUserMutation.isSuccess ? successPage : createUserPage;
};

export default SignupForm;
