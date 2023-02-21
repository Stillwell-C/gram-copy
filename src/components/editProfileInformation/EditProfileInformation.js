import { deleteUser, updateEmail, updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { auth, db } from "../../firebase";
import useGetLoggedInUserInfo from "../../hooks/useGetLoggedInUserInfo";
import useGetLoggedInUserInfoFunction from "../../hooks/useGetLoggedInUserInfoFunction";
import useUploadProfileImg from "../../hooks/useUploadProfileImg";
import DeleteAccountModal from "../deleteAccountModal/DeleteAccountModal";
import "./editProfileInformation.scss";

const EditProfileInformation = () => {
  const { currentUser, dispatch } = useContext(AuthContext);

  const getUserInfo = useGetLoggedInUserInfoFunction();

  const uploadImg = useUploadProfileImg();

  const [updatedInfo, setUpdatedInfo] = useState({
    username: currentUser.displayName,
    fullname: "",
    userBio: "",
    website: "Website",
    email: "",
    userImgURL: currentUser.photoURL,
  });
  const [initialInfo, setInitialInfo] = useState({
    username: currentUser.displayName,
    fullname: "",
    userBio: "",
    website: "Website",
    email: "",
    userImgURL: currentUser.photoURL,
  });
  const [displayDeleteModal, setDisplayDeleteModal] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState([]);
  const [confirmation, setConfirmation] = useState(false);
  const [confirmationMsg, setConfirmationMsg] = useState([]);

  const imgInputRef = useRef(null);
  const btnInputRef = useRef(null);

  useEffect(() => {
    getAllPageData();
  }, []);

  const getAllPageData = async () => {
    const fetchedUserInfo = await getUserInfo();
    const fetchedInfoObject = {
      username: fetchedUserInfo.username,
      fullname: fetchedUserInfo.fullname,
      userBio: fetchedUserInfo.userBio,
      website: "Website",
      email: fetchedUserInfo.email,
      userImgURL: fetchedUserInfo.userImgURL,
    };
    setInitialInfo(fetchedInfoObject);
    setUpdatedInfo(fetchedInfoObject);
  };

  const handleImgClick = () => {
    imgInputRef.current.click();
  };

  const handleBtnClick = () => {
    btnInputRef.current.click();
  };

  const handleImgUpload = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setUpdatedInfo({
        ...updatedInfo,
        userImgURL: URL.createObjectURL(e.target.files[0]),
      });
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
      updatedInfo.fullname !== initialInfo.fullname ||
      updatedInfo.username !== initialInfo.username ||
      updatedInfo.userBio !== initialInfo.userBio
    ) {
      editNameAndUserName();
    }
    if (updatedInfo.email !== initialInfo.email) editUserEmail();
  };

  const editNameAndUserName = async () => {
    if (updatedInfo.username.length < 3 || updatedInfo.username.length > 30) {
      setError(true);
      setErrorMsg([...errorMsg, "Username must be 3-30 characters"]);
      return;
    }
    if (updatedInfo.fullname.length < 3 || updatedInfo.fullname.length > 30) {
      setError(true);
      setErrorMsg([...errorMsg, "Name must be 3-30 characters"]);
      return;
    }
    if (updatedInfo.userBio.length > 150) {
      setError(true);
      setErrorMsg([...errorMsg, "Bio must be less than 150 characters"]);
      return;
    }
    //Check profile name availability
    if (updatedInfo.username !== initialInfo.username) {
      try {
        const existingUserNames = await getDocs(
          query(
            collection(db, "userInfo"),
            where("username", "==", updatedInfo.username)
          )
        );
        if (existingUserNames.docs.length) {
          setError(true);
          setErrorMsg([...errorMsg, "Please choose a different username"]);
          return;
        }
      } catch (err) {
        console.log(err.code);
      }
    }
    try {
      await updateDoc(doc(db, "userInfo", auth.currentUser.uid), {
        fullname: updatedInfo.fullname,
        username: updatedInfo.username,
        userBio: updatedInfo.userBio,
      });
      if (updatedInfo.username !== initialInfo.username) {
        await updateProfile(auth.currentUser, {
          displayName: updatedInfo.username,
        });
      }
      dispatch({
        type: "LOGIN",
        payload: {
          ...currentUser,
          fullname: updatedInfo.fullname,
          username: updatedInfo.username,
          userBio: updatedInfo.userBio,
        },
      });
      setConfirmation(true);
      setConfirmationMsg([...confirmationMsg, "Updated user information"]);
      getAllPageData();
    } catch (err) {
      console.log(err.message);
      console.log(err.code);
      setError(true);
      setErrorMsg([...errorMsg, err.code]);
    }
  };

  const editUserEmail = async () => {
    try {
      await updateEmail(auth.currentUser, updatedInfo.email);
      await updateDoc(doc(db, "userInfo", auth.currentUser.uid), {
        email: updatedInfo.email,
      });
      dispatch({
        type: "LOGIN",
        payload: {
          ...currentUser,
          email: updatedInfo.email,
        },
      });
      setConfirmation(true);
      setConfirmationMsg([...confirmationMsg, "Updated user email"]);
      getAllPageData();
    } catch (err) {
      console.log(err.message);
      console.log(err.code);
      setError(true);
      setErrorMsg([...errorMsg, err.code]);
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
            <img src={updatedInfo.userImgURL} alt='user profile upload' />
          </button>
          <form>
            <input
              autoComplete='off'
              type='file'
              className='file-upload-input'
              accept='image/png, image/jpeg'
              ref={imgInputRef}
              onChange={handleImgUpload}
            />
          </form>
        </div>
        <div className='user-info-right'>
          <div className='username'>{initialInfo.username}</div>
          <button
            aria-label='click to change profile photo'
            onClick={handleBtnClick}
          >
            Change profile photo
          </button>
          <form>
            <input
              autoComplete='off'
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
              autoComplete='off'
              id='name-input'
              name='name-input'
              type='text'
              placeholder='name'
              value={updatedInfo.fullname}
              onChange={(e) =>
                setUpdatedInfo({ ...updatedInfo, fullname: e.target.value })
              }
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
              autoComplete='off'
              id='username-input'
              name='username-input'
              type='text'
              placeholder='username'
              value={updatedInfo.username}
              onChange={(e) =>
                setUpdatedInfo({ ...updatedInfo, username: e.target.value })
              }
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
              autoComplete='off'
              id='website-input'
              name='website-input'
              type='text'
              placeholder='website'
              value={updatedInfo.website}
              onChange={(e) =>
                setUpdatedInfo({ ...updatedInfo, website: e.target.value })
              }
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
              value={updatedInfo.userBio}
              onChange={(e) =>
                setUpdatedInfo({ ...updatedInfo, userBio: e.target.value })
              }
              maxLength='150'
            ></textarea>
            <div className='form-information'>
              {updatedInfo.userBio.length} / 150
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
              autoComplete='off'
              id='email-input'
              name='email-input'
              type='email'
              placeholder='Email'
              value={updatedInfo.email}
              onChange={(e) =>
                setUpdatedInfo({ ...updatedInfo, email: e.target.value })
              }
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
