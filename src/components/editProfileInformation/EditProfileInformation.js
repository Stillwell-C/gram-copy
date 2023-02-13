import { deleteUser } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { auth, db } from "../../firebase";
import useGetLoggedInUserInfo from "../../hooks/useGetLoggedInUserInfo";
import useUploadProfileImg from "../../hooks/useUploadProfileImg";
import DeleteAccountModal from "../deleteAccountModal/DeleteAccountModal";
import "./editProfileInformation.scss";

const EditProfileInformation = () => {
  const { currentUser, dispatch } = useContext(AuthContext);

  const { userImgURL, username, fullname, userBio, email } =
    useGetLoggedInUserInfo();

  const uploadImg = useUploadProfileImg();

  const [updatedImgURL, setUpdatedImgURL] = useState("");
  const [updatedUsername, setUpdatedUsername] = useState("");
  const [updatedFullname, setUpdatedFullname] = useState("");
  const [updatedUserBio, setUpdatedUserBio] = useState("");
  const [updatedWebsite, setUpdatedWebsite] = useState("Website");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [displayDeleteModal, setDisplayDeleteModal] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState([]);
  const [confirmation, setConfirmation] = useState(false);
  const [confirmationMsg, setConfirmationMsg] = useState([]);

  const imgInputRef = useRef(null);
  const btnInputRef = useRef(null);

  useEffect(() => {
    setUpdatedUsername(username);
    setUpdatedFullname(fullname);
    setUpdatedUserBio(userBio);
    setUpdatedEmail(email);
    setUpdatedImgURL(userImgURL);
  }, [username]);

  const handleImgClick = () => {
    imgInputRef.current.click();
  };

  const handleBtnClick = () => {
    btnInputRef.current.click();
  };

  const handleImgUpload = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setUpdatedImgURL(URL.createObjectURL(e.target.files[0]));
      uploadImg(e.target.files[0]);
    }
  };

  const handleEditUserInformation = (e) => {
    e.preventDefault();
    setConfirmation(false);
    setConfirmationMsg([]);
    setError(false);
    setErrorMsg([]);
    if (
      updatedFullname !== fullname ||
      updatedUsername !== username ||
      updatedUserBio !== userBio
    ) {
      editNameAndUserName();
    }
    if (updatedEmail !== email) editUserEmail();
  };

  const editNameAndUserName = async () => {
    if (updatedUsername.length < 3 || updatedUsername.length > 30) {
      setError(true);
      setErrorMsg([...errorMsg, "Username must be 3-30 characters"]);
      return;
    }
    if (updatedFullname.length < 3 || updatedFullname.length > 30) {
      setError(true);
      setErrorMsg([...errorMsg, "Name must be 3-30 characters"]);
      return;
    }
    if (updatedUserBio.length > 150) {
      setError(true);
      setErrorMsg([...errorMsg, "Bio must be less than 150 characters"]);
      return;
    }
    try {
      await updateDoc(doc(db, "userInfo", currentUser.userInfoID), {
        fullname: updatedFullname,
        username: updatedUsername,
        userBio: updatedUserBio,
      });
      dispatch({
        type: "LOGIN",
        payload: {
          ...currentUser,
          fullname: updatedFullname,
          username: updatedUsername,
          userBio: updatedUserBio,
        },
      });
      setConfirmation(true);
      setConfirmationMsg([...confirmationMsg, "Updated user information"]);
    } catch (err) {
      console.log(err.message);
      console.log(err.code);
      setError(true);
      setErrorMsg([...errorMsg, err.message]);
    }
  };

  const editUserEmail = async () => {
    try {
      await updatedEmail(auth.currentUser, updatedEmail);
      await updateDoc(doc(db, "userInfo", currentUser.userInfoID), {
        email: updatedEmail,
      });
      dispatch({
        type: "LOGIN",
        payload: {
          ...currentUser,
          email: updatedEmail,
        },
      });
      setConfirmation(true);
      setConfirmationMsg([...confirmationMsg, "Updated user email"]);
    } catch (err) {
      console.log(err.message);
      console.log(err.code);
      setError(true);
      setErrorMsg([...errorMsg, err.message]);
    }
  };

  return (
    <div className='edit-profile-information-container'>
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
          <button
            title='Click to change profile picture'
            aria-label='click to change profile photo'
            onClick={handleImgClick}
          >
            <img src={updatedImgURL} alt='user profile upload' />
          </button>
          <form>
            <input
              type='file'
              className='file-upload-input'
              accept='image/png, image/jpeg'
              ref={imgInputRef}
              onChange={handleImgUpload}
            />
          </form>
        </div>
        <div className='user-info-right'>
          <div className='username'>{username}</div>
          <button
            aria-label='click to change profile photo'
            onClick={handleBtnClick}
          >
            Change profile photo
          </button>
          <form>
            <input
              type='file'
              className='file-upload-input'
              accept='image/png, image/jpeg'
              ref={btnInputRef}
              onChange={handleImgUpload}
            />
          </form>
        </div>
      </div>
      <form onSubmit={handleEditUserInformation}>
        <div className='form-row'>
          <div className='form-left'>
            <label htmlFor='name-input'>Name</label>
          </div>

          <div className='form-right'>
            <input
              id='name-input'
              name='name-input'
              type='text'
              placeholder='name'
              value={updatedFullname}
              onChange={(e) => setUpdatedFullname(e.target.value)}
            />
            <div className='form-information'>
              <span>
                Help people discover your account by using the name you're known
                by: either your full name, nickname, or business name.
              </span>
            </div>
          </div>
        </div>
        <div className='form-row'>
          <div className='form-left'>
            <label htmlFor='username-input'>Username</label>
          </div>
          <div className='form-right'>
            <input
              id='username-input'
              name='username-input'
              type='text'
              placeholder='username'
              value={updatedUsername}
              onChange={(e) => setUpdatedUsername(e.target.value)}
            />
            <div className='form-information'>
              <span>
                In most cases, you'll be able to change your username back to
                hodgethecatt for another 14 days.
              </span>
            </div>
          </div>
        </div>
        <div className='form-row'>
          <div className='form-left'>
            <label htmlFor='website-input'>Website</label>
          </div>
          <div className='form-right'>
            <input
              id='website-input'
              name='website-input'
              type='text'
              placeholder='website'
              value={updatedWebsite}
              onChange={(e) => setUpdatedWebsite(e.target.value)}
              disabled
            />
            <div className='form-information'>
              <span>
                Editing your links is only available on mobile. Visit the
                Instagram app and edit your profile to change the websites in
                your bio.
              </span>
            </div>
          </div>
        </div>
        <div className='form-row'>
          <div className='form-left'>
            <label htmlFor='bio-input'>Bio</label>
          </div>
          <div className='form-right'>
            <textarea
              id='bio-input'
              name='bio-input'
              type='text'
              value={updatedUserBio}
              onChange={(e) => setUpdatedUserBio(e.target.value)}
              maxLength='150'
            ></textarea>
            <div className='form-information'>
              {updatedUserBio.length} / 150
            </div>
          </div>
        </div>
        <div className='form-row'>
          <div className='form-left'></div>
          <div className='form-right'>
            <div className='form-information personal-information-disclaimer'>
              <h2>Personal Information</h2>
              <span>
                Provide your personal information, even if the account is used
                for a business, a pet or something else. This won't be a part of
                your public profile.
              </span>
            </div>
          </div>
        </div>
        <div className='form-row'>
          <div className='form-left'>
            <label htmlFor='email-input'>Email</label>
          </div>
          <div className='form-right'>
            <input
              id='email-input'
              name='email-input'
              type='email'
              placeholder='Email'
              value={updatedEmail}
              onChange={(e) => setUpdatedEmail(e.target.value)}
            />
          </div>
        </div>
        <div className='button-div'>
          <div className='button-div-right'>
            <div className='submit-button-div'>
              <button type='submit' className='submit-button'>
                Submit
              </button>
            </div>
            <div className='extra-button-div'>
              <button
                type='button'
                className='extra-button'
                onClick={() => setDisplayDeleteModal(true)}
              >
                Delete my account
              </button>
            </div>
          </div>
        </div>
      </form>
      {displayDeleteModal && (
        <DeleteAccountModal setDisplayDeleteModal={setDisplayDeleteModal} />
      )}
    </div>
  );
};

export default EditProfileInformation;
