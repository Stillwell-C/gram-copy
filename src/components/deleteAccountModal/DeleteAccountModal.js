import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { auth, db } from "../../firebase";
import useGetLoggedInUserInfoFunction from "../../hooks/useGetLoggedInUserInfoFunction";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";
import "./deleteAccountModal.scss";

const DeleteAccountModal = ({ setDisplayDeleteModal }) => {
  const { currentUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const [checkbox, setCheckbox] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const [confirmationMsg, setConfirmationMsg] = useState("");
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);

  const getUserInfo = useGetLoggedInUserInfoFunction();

  useEffect(() => {
    const fetchAndSetData = async () => {
      const userInfo = await getUserInfo();
      setUserData(userInfo);
    };
    fetchAndSetData();
  }, []);

  const handleClose = () => {
    setDisplayDeleteModal(false);
  };

  const deleteAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    setConfirmation(false);
    setConfirmationMsg("");
    setError(false);
    setErrorMsg("");
    if (!checkbox) {
      setError(true);
      setErrorMsg("You must agree to the terms of service");
      setLoading(false);
      return;
    }
    if (!password.length) {
      setError(true);
      setErrorMsg("Please input your password");
      setLoading(false);
      return;
    }
    if (!userData.userPosts) {
      setError(true);
      setErrorMsg("Error retrieving user information. Please try again.");
      setLoading(false);
      return;
    }
    const user = auth.currentUser;
    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        password
      );
      await reauthenticateWithCredential(user, credential);
      for (let post of userData.userPosts) {
        console.log(post);
        const fetchedPost = await getDoc(doc(db, "userImgs", post));
        const postData = fetchedPost.data();
        await setDoc(doc(db, "deletedUserPosts", post), { ...postData });
        await deleteDoc(doc(db, "userImgs", post));
      }
      await setDoc(doc(db, "deletedUsers", currentUser.uid), { ...userData });
      await deleteDoc(doc(db, "userInfo", currentUser.uid));
      await deleteUser(user);
      setConfirmation(true);
      setConfirmationMsg("Your account has been deleted");
      setLoading(false);
      navigate("/");
    } catch (err) {
      console.log(err.message);
      console.log(err.code);
      setError(true);
      setErrorMsg(err.code);
      setLoading(false);
    }
  };

  return (
    <>
      <div className='delete-account-modal-container'>
        <div className='delete-account-modal'>
          <div className='modal-header'>
            <h1>Delete your account</h1>
          </div>
          <div className='modal-body'>
            <div
              className={
                confirmation || error
                  ? "user-msg-container active"
                  : "user-msg-container"
              }
            >
              <div className='error-msg'>{errorMsg}</div>
              <div className='confirmation-msg'>{confirmationMsg}</div>
            </div>
            <h2 className='modal-body-header'>
              Are you sure you want to delete your account?
            </h2>
            <div className='modal-confirmation'>
              <form onSubmit={deleteAccount}>
                <span className='larger-text'>We're sad to see you go.</span>
                <div className='fine-print-div'>
                  <span className='fine-print'>
                    {
                      "By opting to delete their account and clicking the below 'Delete account' button the user of this account (hereinafter \"User\") is agreeing to Instagram's terms of service. By deleting their account, User forfeits any and all rights to any information, data, images, etc. (hereinafter \"User Data\") that has been disclosed, provided, or uploaded to Instagram and relinquishes to Instagram the right to use and retain the User Data as well as User's image and likeness for any means including but not limited to commercial purposes in perpetuity across and throughout this or any other universe. Furthermore, by deleting this account, User knowingly and voluntarily forfeits any rights, protections, or privileges granted, provided, or guaranteed by any local, national, or international statute or law; international custom; multi-state, international, or United Nations treaty, pact, or convention; maritime law; or general principles of law with respect to the User Data and User's image and likeness, use and monetization of the User Data and User's image and likeness, and any objections thereto. Further, by deleting this account, User knowingly and voluntarily forfeits any right to make any legal objection to any provision herein or take any legal action against Instagram through local, national, or international legal systems and agrees to settle any and all objections through a private third-party mediator, provided that said mediator shall be selected by Instagram and any monetary compensation such as fees, expenses, or wages required by said mediator shall be paid in full by User. Further, should any legal action be taken against Instagram by User, User knowingly and voluntarily agrees to pay in full any and all legal expenses incurred by Instagram in relation to said legal action regardless of the outcome of said legal action."
                    }
                  </span>
                </div>
                <label
                  id='agree-to-terms'
                  className='agree-label'
                  aria-label="Check this box to agree to above terms & Instagram's terms of service"
                >
                  <input
                    type='checkbox'
                    name='agree-to-terms'
                    id='agree-to-terms'
                    onChange={(e) => setCheckbox(e.target.checked)}
                    className='agree-checkbox'
                  />
                  Agree to above terms & Instagram's terms of service
                </label>
                <div className='confirmation-div'>
                  <div className='confirmation-prompt'>
                    Please enter your password below to delete your account.
                    After deleting your account, you will be not be able to
                    reactivate your account.
                  </div>
                  <label aria-label='Please enter your password to delete your account'>
                    <input
                      type='password'
                      placeholder='password'
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </label>
                </div>
                {!loading && (
                  <div className='button-div'>
                    <button
                      className='delete-button'
                      aria-label='click this button to delete your account'
                      type='submit'
                    >
                      Delete account
                    </button>
                  </div>
                )}
                {loading && (
                  <div className='delete-loading-div'>
                    <div className='loading-spinner-div'>
                      <LoadingSpinner />
                    </div>
                    <p>Deleting Account...</p>
                    <p>Do not refresh or close page.</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className='modal-overlay' onClick={handleClose}>
        <div className='modal-overlay-close'>
          <button
            className='delete-button'
            aria-label='Click to close delete account modal'
          >
            &times;
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteAccountModal;
