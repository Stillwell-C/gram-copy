import React, { useState } from "react";
import useGetLoggedInUserInfo from "../../hooks/useGetLoggedInUserInfo";
import "./editProfilePassword.scss";

export const EditProfilePassword = () => {
  const { userImgURL, username } = useGetLoggedInUserInfo();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
      <form>
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
              <button type='submit' className='submit-button'>
                Change password
              </button>
            </div>
            <div className='extra-button-div'>
              <button type='button' className='extra-button'>
                Forgot password?
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
