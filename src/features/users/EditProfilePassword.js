import React, { useEffect, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useMutation } from "react-query";
import { updateUser } from "./usersApiRoutes";

const PWD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,24}$/;

export const EditProfilePassword = () => {
  const { img, username } = useAuth();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordClick, setNewPasswordClick] = useState(false);
  const [newPasswordSuccess, setNewPasswordSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const [confirmationMsg, setConfirmationMsg] = useState("");

  const userImgURL = `https://res.cloudinary.com/danscxcd2/image/upload/w_90,c_fill/${img}`;

  const errRef = useRef();
  const successRef = useRef();

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {},
  });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setConfirmation(false);
    setConfirmationMsg("");
    setError(false);
    setErrorMsg("");
    if (!oldPassword.length || !newPassword.length || !confirmPassword.length) {
      setError(true);
      setErrorMsg(
        "Please enter your old password, new password, and new password confirmation"
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(true);
      setErrorMsg("Passwords do not match");
      return;
    }
    if (!PWD_REGEX.test(newPassword)) {
      setError(true);
      setErrorMsg("Invalid password.");
      return;
    }
    updateUserMutation.mutate({ oldPassword, newPassword });
  };

  useEffect(() => {
    if (PWD_REGEX.test(newPassword)) {
      setNewPasswordSuccess(true);
      return;
    }
    setNewPasswordSuccess(false);
  }, [newPassword]);

  useEffect(() => {
    if (updateUserMutation.isError) {
      setError(true);
      setErrorMsg(
        updateUserMutation?.error?.response?.data?.message ||
          "An error occurred. Please try again."
      );
      errRef.current.focus();
    }
  }, [updateUserMutation.isError]);

  useEffect(() => {
    if (updateUserMutation.isSuccess) {
      setConfirmation(true);
      setConfirmationMsg("Password updated");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      successRef.current.focus();
    }
  }, [updateUserMutation.isSuccess]);

  return (
    <div className='edit-profile-password-container'>
      <div
        className={
          error || confirmation ? "user-msg-div active" : "user-msg-div"
        }
      >
        <div
          aria-live='assertive'
          ref={errRef}
          className={error ? "user-error-div active" : "user-error-div"}
        >
          {<span className='error-msg'>{errorMsg}</span>}
        </div>
        <div
          className={
            confirmation
              ? "user-confirmation-div active"
              : "user-confirmation-div"
          }
          aria-live='assertive'
          ref={successRef}
        >
          {<span className='confirmation-msg'>{confirmationMsg}</span>}
        </div>
      </div>
      <div className='user-info flex-container'>
        <div className='profile-img-div flex-container flex-align-center flex-justify-center'>
          <img
            src={userImgURL}
            alt='user profile upload'
            className='circular-image'
          />
        </div>
        <div className='user-info-right flex-container fg-1 flex-align-center'>
          <div className='username'>{username}</div>
        </div>
      </div>
      <form onSubmit={handleChangePassword} className='password-form'>
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
              aria-label='old password'
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
              aria-label='new password'
              aria-describedby='passwordNote'
              aria-invalid={!newPasswordSuccess}
              onFocus={() => setNewPasswordClick(true)}
              onBlur={() => setNewPasswordClick(false)}
            />
            <p
              id='passwordNote'
              className={
                newPasswordClick && !newPasswordSuccess && newPassword.length
                  ? "form-description margin-top-5p"
                  : "offscreen"
              }
            >
              8 to 24 characters. <br />
              Must include at least one letter and one number.
            </p>
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
              aria-label='new password confirmation'
              aria-invalid={newPassword !== confirmPassword}
            />
          </div>
        </div>
        <div className='button-div'>
          <div className='button-div-right'>
            <div className='submit-button-div'>
              <button
                type='submit'
                className='submit-button standard-button blue-button'
                disabled={
                  !(
                    oldPassword.length &&
                    newPassword.length &&
                    confirmPassword.length
                  )
                }
              >
                Change password
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
