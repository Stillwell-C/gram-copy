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
import "./editProfilePassword.scss";

export const EditProfilePassword = () => {
  const { userImgURL, username } = useGetLoggedInUserInfo();

  const { currentUser } = useContext(AuthContext);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [buttonActive, setButtonActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
    const user = auth.currentUser;
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }
    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        oldPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
    } catch (err) {
      console.log(err.message);
      console.log(err.code);
    }
  };

  const handleSendPasswordEmail = async () => {
    //TODO: alert user of success or failure
    //TODO: test with email yo ucontrol
    try {
      await sendPasswordResetEmail(auth, currentUser.email);
    } catch (err) {
      console.log(err.message);
      console.log(err.code);
    }
  };

  return (
    <div className='edit-profile-password-container'>
      <div className='user-info'>
        <div className='profile-img-div'>
          <img src={userImgURL} alt='user profile upload' />
        </div>
        <div className='user-info-right'>
          <div className='username'>{username}</div>
        </div>
      </div>
      <form onSubmit={handleChangePassword}>
        <div className='form-row'>
          <div className='form-left'>
            <label htmlFor='old-password'>Old password</label>
          </div>
          <div className='form-right'>
            <input
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
