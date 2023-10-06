import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../scss/deleteAccountModal.scss";
import { useMutation, useQueryClient } from "react-query";
import useAuth from "../../hooks/useAuth";
import { FadeLoader } from "react-spinners";
import { deleteUser } from "./usersApiRoutes";
import FocusTrapModalParent from "../../components/FocusTrapModalParent";
import { logout } from "../auth/authApiRoutes";
import FadeLoaderStyled from "../../components/FadeLoaderStyled";

const DeleteAccountModal = ({ setDisplayDeleteModal }) => {
  const { id } = useAuth();

  const navigate = useNavigate();
  const errRef = useRef(null);

  const [checkbox, setCheckbox] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      navigate("/");
    },
  });

  const handleLogout = async () => {
    logoutMutation.mutate();
  };

  const queryClient = useQueryClient();

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries();
      handleLogout();
    },
  });

  useEffect(() => {
    if (deleteUserMutation.isError || error) {
      errRef.current.focus();
    }
  }, [deleteUserMutation.isError, error]);

  const handleClose = () => {
    setDisplayDeleteModal(false);
  };

  const deleteAccount = async (e) => {
    e.preventDefault();
    setError(false);
    setErrorMsg("");
    if (!checkbox) {
      setError(true);
      setErrorMsg("You must agree to the terms of service");
      return;
    }
    if (!password.length) {
      setError(true);
      setErrorMsg("Please input your password");
      return;
    }
    deleteUserMutation.mutate({
      userID: id,
      userPassword: password,
    });
  };

  const content = (
    <div
      className='delete-account-modal-container modal-body'
      role='dialog'
      aria-labelledby='dialog-header'
    >
      <div className='delete-account-modal'>
        <div className='modal-header flex-container width-100 flex-align-center flex-justify-center'>
          <h2 id='dialog-header'>Delete your account</h2>
        </div>
        <div className='modal-body height-100 width-100 flex-container flex-column flex-align-center flex-justify-center gap-1'>
          <div
            className={
              deleteUserMutation.isError || error
                ? "user-msg-container active"
                : "user-msg-container"
            }
          >
            <div className='error-msg' ref={errRef}>
              {deleteUserMutation?.error?.response?.data?.message}
              {errorMsg}
            </div>
          </div>
          <h3 className='modal-body-header'>
            Are you sure you want to delete your account?
          </h3>
          <div className='modal-confirmation'>
            <form
              onSubmit={deleteAccount}
              className='flex-container flex-column gap-1'
            >
              <p className='larger-text'>We're sad to see you go.</p>
              <div className='fine-print-div'>
                <span
                  className='fine-print'
                  aria-label="Instagram's terms for account deletion"
                >
                  {
                    "By opting to delete this account and clicking the below 'Delete account' button the user of this account (hereinafter \"User\") hereby agrees to Instagram's terms of service. By deleting this account, User forfeits any and all rights to any information, data, images, etc. (hereinafter \"User Data\") that has been disclosed, provided, or uploaded to Instagram and relinquishes to Instagram the right to use and retain User Data as well as User's image and likeness for any means including but not limited to commercial purposes in perpetuity across and throughout this or any other universe. Furthermore, by deleting this account, User knowingly and voluntarily forfeits any rights, protections, or privileges granted, provided, or guaranteed by any local, national, or international statute or law; international custom; multi-state, international, or United Nations treaty, pact, protocol, convention, etc.; maritime law; or general principle of law with respect to User Data and User's image and likeness, use and monetization of User Data and User's image and likeness, retention in perpetuity of User Data and User's image and likeness, and use of User Data and User's image and likeness by a computer(s) or computer system(s), including artificial intelligence, or physical beings including human beings for any means including but not limited to commercial purposes, including but not limited to the editing of User Data and User's image and likeness and use of edited User Data and User's image and likeness; the creation, synthesis, use, etc. of User Data and User's image and likeness for purposes including but not limited to the creation of new users or user data; etc. for any use including for commercial and promotional uses. Further, by deleting this account, User knowingly and voluntarily forfeits any right to make any legal objection to any provision herein or take any legal action against Instagram through local, national, or international legal systems and agrees to settle any and all objections through a private third-party mediator, provided that the mediator shall be selected by Instagram and any monetary compensation such as fees, expenses, or wages required by the mediator shall be paid in full by User regardless of the decision of the mediator. Further, should any legal action be taken against Instagram by User, User knowingly and voluntarily agrees to pay in full any and all legal expenses incurred by Instagram in relation to this legal action regardless of the outcome of the legal action."
                  }
                </span>
              </div>
              <label
                id='agree-to-terms'
                className='agree-label flex-container flex-justify-start flex-align-center'
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
                  Please enter your password below to delete your account. After
                  deleting your account, you will be not be able to reactivate
                  your account.
                </div>
                <label aria-label='Please enter your password to delete your account'>
                  <input
                    type='password'
                    placeholder='password'
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
              </div>
              {!deleteUserMutation.isLoading && (
                <div className='button-div flex-container flex-align-center flex-justify-center'>
                  <button
                    className='delete-button standard-button blue-button'
                    aria-label='click this button to delete your account'
                    type='submit'
                  >
                    Delete account
                  </button>
                </div>
              )}
              {deleteUserMutation.isLoading && (
                <div className='delete-loading-div flex-container flex-align-center flex-justify-center flex-column'>
                  <div className='loading-spinner-div'>
                    <FadeLoaderStyled />
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
  );

  return <FocusTrapModalParent content={content} handleClose={handleClose} />;
};

export default DeleteAccountModal;
