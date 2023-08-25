import React, { useEffect, useState } from "react";
import "./editProfilePassword.scss";
import useAuth from "../../hooks/useAuth";
import { useMutation } from "react-query";
import { updateUser } from "../../features/users/usersApiRoutes";

export const EditProfilePassword = () => {
  const { id, img, username } = useAuth();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const [confirmationMsg, setConfirmationMsg] = useState("");

  const userImgURL = `https://res.cloudinary.com/danscxcd2/image/upload/w_150,c_fill/${img}`;

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
    if (newPassword !== confirmPassword) {
      setError(true);
      setErrorMsg("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError(true);
      setErrorMsg("Password must be at least 6 characters long");
      return;
    }
    updateUserMutation.mutate({ oldPassword, newPassword, id });
  };

  useEffect(() => {
    if (updateUserMutation.isError) {
      setError(true);
      setErrorMsg(updateUserMutation.error.response.data.message);
    }
  }, [updateUserMutation.isError]);

  useEffect(() => {
    if (updateUserMutation.isSuccess) {
      setConfirmation(true);
      setConfirmationMsg("Password updated");
    }
  }, [updateUserMutation.isSuccess]);

  const handleSendPasswordEmail = async () => {
    //TODO: alert user of success or failure
    //TODO: test with email yo ucontrol
  };

  return (
    <div className='edit-profile-password-container'>
      <div
        className={
          error || confirmation ? "user-msg-div active" : "user-msg-div"
        }
      >
        <div className={error ? "user-error-div active" : "user-error-div"}>
          {<span className='error-msg'>{errorMsg}</span>}
        </div>
        <div
          className={
            confirmation
              ? "user-confirmation-div active"
              : "user-confirmation-div"
          }
        >
          {<span className='confirmation-msg'>{confirmationMsg}</span>}
        </div>
      </div>
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
                className='submit-button'
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
            {/* <div className='extra-button-div'>
              <button
                type='button'
                className='extra-button'
                onClick={handleSendPasswordEmail}
              >
                Forgot password?
              </button>
            </div> */}
          </div>
        </div>
      </form>
    </div>
  );
};
