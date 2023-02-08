import { useContext, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db, getURL } from "../../firebase";
import { AuthContext } from "../../context/authContext";
import logo from "../../assets/Instagram_logo.png";
import { Link, useNavigate } from "react-router-dom";

const SignupForm = () => {
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  const { dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    signUpUser();
  };

  const signUpUser = async () => {
    if (userName.length < 3 || userName.length > 15) {
      setError(true);
      setErrorMsg("Username must be 3-15 characters");
      return;
    }
    if (fullName.length < 3 || userName.length > 30) {
      setError(true);
      setErrorMsg("Name must be 3-30 characters");
      return;
    }
    try {
      setError(false);
      setErrorMsg("");
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
      setErrorMsg(err.message);
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
        <form className='sign-up-form' onSubmit={handleSignup}>
          <input
            type='email'
            placeholder='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type='text'
            placeholder='username'
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type='text'
            placeholder='fullname'
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type='password'
            placeholder='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type='submit'>Sign up</button>
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
