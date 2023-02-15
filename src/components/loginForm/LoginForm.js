import { useContext, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db, getURL } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { AuthContext } from "../../context/authContext";
import logo from "../../assets/Instagram_logo.png";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    signInUser();
  };

  const signInUser = async () => {
    try {
      setError(false);
      setErrorMsg("");
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userQuery = await getDocs(
        query(collection(db, "userInfo"), where("email", "==", email))
      );
      const userInfo = userQuery.docs[0].data();
      const userImgURL = await getURL(userInfo.userImg);
      dispatch({
        type: "LOGIN",
        payload: {
          ...userCredentials.user,
          ...userInfo,
          userImgURL: userImgURL,
          userInfoID: userQuery.docs[0].id,
        },
      });
      navigate("/");
    } catch (err) {
      setError(true);
      setErrorMsg(err.code);
      console.log(err.code, err.message);
    }
  };

  return (
    <>
      <div className='login-top'>
        <img src={logo} alt='instagram logo' className='login-logo' />
        {error && <div className='error-div'>{errorMsg}</div>}
        <form className='login-form' onSubmit={handleSignIn}>
          <input
            type='email'
            placeholder='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type='password'
            placeholder='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type='submit'>Log in</button>
          <span className='login-error-span'></span>
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
