import { useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { auth, db, getURL } from "../../firebase";
import { AuthContext } from "../../context/authContext";
import logo from "../../assets/Instagram_logo.png";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";
import errorIcon from "../../assets/error-warning-danger-problem-attention-svgrepo-com.svg";
import successIcon from "../../assets/check-circle-svgrepo-com.svg";

const SignupForm = () => {
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [email, setEmail] = useState("");
  const [emailClick, setEmailClick] = useState(false);
  const [emailClass, setEmailClass] = useState("form-input-div");
  const [emailSuccess, setEmailSuccess] = useState(null);
  const [userName, setUserName] = useState("");
  const [userNameClick, setUserNameClick] = useState(false);
  const [userNameClass, setUserNameClass] = useState("form-input-div");
  const [userNameSuccess, setUserNameSuccess] = useState(null);
  const [fullName, setFullName] = useState("");
  const [fullNameClass, setFullNameClass] = useState("form-input-div");
  const [fullNameClick, setFullNameClick] = useState(false);
  const [fullNameSuccess, setFullNameSuccess] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordClick, setPasswordClick] = useState(false);
  const [passwordClass, setPasswordClass] = useState("form-input-div");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    const active = email.length ? "active" : "";
    const click = emailClick ? "clicked" : "";
    const icon = emailSuccess !== null ? "display-icon" : "";
    setEmailClass(`form-input-div ${active} ${click} ${icon}`);
    if (emailSuccess === false) handleEmailCheck();
  }, [email, emailClick, emailSuccess]);

  useEffect(() => {
    const active = userName.length ? "active" : "";
    const click = userNameClick ? "clicked" : "";
    const icon = userNameSuccess !== null ? "display-icon" : "";
    setUserNameClass(`form-input-div ${active} ${click} ${icon}`);
    if (userNameSuccess === false) handleUsernameCheck();
  }, [userName, userNameClick, userNameSuccess]);

  useEffect(() => {
    const active = fullName.length ? "active" : "";
    const click = fullNameClick ? "clicked" : "";
    const icon = fullNameSuccess !== null ? "display-icon" : "";
    setFullNameClass(`form-input-div ${active} ${click} ${icon}`);
    if (fullNameSuccess === false) handleFullnameCheck();
  }, [fullName, fullNameClick, fullNameSuccess]);

  useEffect(() => {
    const active = password.length ? "active" : "";
    const click = passwordClick ? "clicked" : "";
    setPasswordClass(`form-input-div ${active} ${click}`);
  }, [password, passwordClick]);

  const handleEmailCheck = () => {
    setEmailClick(false);
    fetchSignInMethodsForEmail(auth, email)
      .then((signInMethods) => {
        signInMethods.length < 1
          ? setEmailSuccess(true)
          : setEmailSuccess(false);
      })
      .catch(setEmailSuccess(false));
  };

  const handleUsernameCheck = () => {
    setUserNameClick(false);
    checkUsername();
  };

  const checkUsername = async () => {
    try {
      const existingUserNames = await getDocs(
        query(collection(db, "userInfo"), where("username", "==", userName))
      );
      existingUserNames.docs.length < 1
        ? setUserNameSuccess(true)
        : setUserNameSuccess(false);
    } catch (err) {
      setUserNameSuccess(false);
    }
  };

  const handleFullnameCheck = () => {
    setFullNameClick(false);
    fullName.length > 2 && fullName.length < 30
      ? setFullNameSuccess(true)
      : setFullNameSuccess(false);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    signUpUser();
  };

  const signUpUser = async () => {
    setError(false);
    setErrorMsg("");
    setLoading(true);
    if (userName.length < 3 || userName.length > 30) {
      setError(true);
      setErrorMsg("Username must be 3-30 characters");
      setLoading(false);
      return;
    }
    if (fullName.length < 3 || fullName.length > 30) {
      setError(true);
      setErrorMsg("Name must be 3-30 characters");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError(true);
      setErrorMsg("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }
    await checkUsername();
    if (!userNameSuccess) {
      setError(true);
      setErrorMsg("Please choose a different username");
      setLoading(false);
      return;
    }
    if (
      !email.length ||
      !userName.length ||
      !fullName.length ||
      !password.length
    ) {
      setError(true);
      setErrorMsg("Please complete all fields");
      setLoading(false);
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      //Upload new user information to DB to be accessed at a later time
      const userData = {
        email: user.email,
        username: userName,
        fullname: fullName,
        following: [],
        followers: [],
        likedPosts: [],
        savedPosts: [],
        taggedPosts: [],
        userPosts: [],
        userBio: "",
        userImg: "gs://driveproject-34ebb.appspot.com/Default_pfp.svg",
      };
      const userInfoUpload = await addDoc(collection(db, "userInfo"), userData);
      const userImgURL = await getURL(userData.userImg);
      dispatch({
        type: "LOGIN",
        payload: {
          ...user,
          ...userData,
          userImgURL: userImgURL,
          userInfoID: userInfoUpload.id,
        },
      });
      navigate("/");
    } catch (err) {
      const errorCode = err.code;
      console.log("Error code: ", errorCode);
      console.log("error msg: ", err.message);
      setError(true);
      setErrorMsg(err.code);
      setLoading(false);
    }
  };

  return (
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
        {error && (
          <div className='error-div'>
            <div className='error-msg'>{errorMsg}</div>
          </div>
        )}
        <form className='sign-up-form' onSubmit={handleSignup}>
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
          <div className={fullNameClass}>
            <label aria-label='full name' htmlFor='fullname'>
              <span className='label-text'>Full Name</span>
              <input
                type='text'
                id='fullname'
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete='off'
                name='email'
                onFocus={() => setFullNameClick(true)}
                onBlur={handleFullnameCheck}
              />
            </label>
            <div className='input-side-div'>
              <img
                className='icon'
                aria-label={fullNameSuccess ? "check mark icon" : "x icon"}
                src={fullNameSuccess ? successIcon : errorIcon}
              />
            </div>
          </div>
          <div className={userNameClass}>
            <label aria-label='username' htmlFor='username'>
              <span className='label-text'>Username</span>
              <input
                type='text'
                id='username'
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                autoComplete='off'
                name='email'
                onFocus={() => setUserNameClick(true)}
                onBlur={handleUsernameCheck}
              />
            </label>
            <div className='input-side-div'>
              <img
                className='icon'
                aria-label={userNameSuccess ? "check mark icon" : "x icon"}
                src={userNameSuccess ? successIcon : errorIcon}
              />
            </div>
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
          {loading ? (
            <div className='loading-spinner-div'>
              <LoadingSpinner />
            </div>
          ) : (
            <button type='submit'>Log in</button>
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
};

export default SignupForm;
