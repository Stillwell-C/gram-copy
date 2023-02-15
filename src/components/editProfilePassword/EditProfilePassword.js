import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  updatePassword,
} from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { auth } from "../../firebase";
import useGetLoggedInUserInfo from "../../hooks/useGetLoggedInUserInfo";
import useGetLoggedInUserInfoFunction from "../../hooks/useGetLoggedInUserInfoFunction";
import "./editProfilePassword.scss";

export const EditProfilePassword = () => {
  // const { userImgURL, username } = useGetLoggedInUserInfo();
  const getUserInfo = useGetLoggedInUserInfoFunction();

  const { currentUser } = useContext(AuthContext);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [buttonActive, setButtonActive] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState([]);
  const [confirmation, setConfirmation] = useState(false);
  const [confirmationMsg, setConfirmationMsg] = useState([]);
  const [pageImgURL, setPageImgURL] = useState(currentUser.userImgURL);
  const [pageUsername, setPageUsername] = useState(currentUser.username);

  useEffect(() => {
    const getAllPageInfo = async () => {
      const fetchedUserInfo = await getUserInfo();
      setPageImgURL(fetchedUserInfo.userImgURL);
      setPageUsername(fetchedUserInfo.username);
    };
    getAllPageInfo();
  }, []);

  useEffect(() => {
    if (oldPassword.length && newPassword.length && confirmPassword.length) {
      setButtonActive(true);
      return;
    }
    setButtonActive(false);
  }, [oldPassword, newPassword, confirmPassword]);

  const handleChangePassword = async (e) => {
    //TODO: handle errors
    e.preventDefault();
    setConfirmation(false);
    setConfirmationMsg([]);
    setError(false);
    setErrorMsg([]);
    const user = auth.currentUser;
    if (newPassword !== confirmPassword) {
      setError(true);
      setErrorMsg(["Passwords do not match"]);
      return;
    }
    if (newPassword.length < 6) {
      setError(true);
      setErrorMsg(["Password must be at least 6 characters long"]);
      return;
    }
    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        oldPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setConfirmation(true);
      setConfirmationMsg(["Your password has been changed."]);
    } catch (err) {
      console.log(err.message);
      console.log(err.code);
      setError(true);
      setErrorMsg([err.message]);
    }
  };

  const handleSendPasswordEmail = async () => {
    //TODO: alert user of success or failure
    //TODO: test with email yo ucontrol
    setConfirmation(false);
    setConfirmationMsg([]);
    setError(false);
    setErrorMsg([]);
    try {
      await sendPasswordResetEmail(auth, currentUser.email);
      setConfirmation(true);
      setConfirmationMsg();
      setConfirmation(true);
      setConfirmationMsg([
        "A password reset email has been sent to your inbox.",
      ]);
    } catch (err) {
      console.log(err.message);
      console.log(err.code);
      setError(true);
      setErrorMsg(["Error. Please try again."]);
    }
  };

  return (
    <div className='edit-profile-password-container'>
      <div
        className={
          error || confirmation ? "user-msg-div active" : "user-msg-div"
        }
      >
        <div className={error ? "user-error-div active" : "user-error-div"}>
          {errorMsg.map((msg) => (
            <span key={msg} className='error-msg'>
              {msg}
            </span>
          ))}
        </div>
        <div
          className={
            confirmation
              ? "user-confirmation-div active"
              : "user-confirmation-div"
          }
        >
          {confirmationMsg.map((msg) => (
            <span key={msg} className='confirmation-msg'>
              {msg}
            </span>
          ))}
        </div>
      </div>
      <div className='user-info'>
        <div className='profile-img-div'>
          <img src={pageImgURL} alt='user profile upload' />
        </div>
        <div className='user-info-right'>
          <div className='username'>{pageUsername}</div>
        </div>
      </div>
      <form onSubmit={handleChangePassword}>
        <div className='form-row'>
          <div className='form-left'>
            <label htmlFor='old-password'>Old password</label>
          </div>
          <div className='form-right'>
            <input
              autoComplete='off'
              id='old-password'
              name='old-password'
              type='password'
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className='password-input'
            />
          </div>
        </div>
        <div className='form-row'>
          <div className='form-left'>
            <label htmlFor='new-password'>New password</label>
          </div>
          <div className='form-right'>
            <input
              autoComplete='off'
              id='new-password'
              name='new-password'
              type='password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className='password-input'
            />
          </div>
        </div>
        <div className='form-row'>
          <div className='form-left'>
            <label htmlFor='confirm-password'>Confirm new password</label>
          </div>
          <div className='form-right'>
            <input
              autoComplete='off'
              id='confirm-password'
              name='confirm-password'
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='password-input'
            />
          </div>
        </div>
        <div className='button-div'>
          <div className='button-div-right password'>
            <div className='submit-button-div'>
              <button
                type='submit'
                className={
                  buttonActive ? "submit-button active" : "submit-button"
                }
                disabled={!buttonActive}
              >
                Change password
              </button>
            </div>
            <div className='extra-button-div'>
              <button
                type='button'
                className='extra-button'
                onClick={handleSendPasswordEmail}
              >
                Forgot password?
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
