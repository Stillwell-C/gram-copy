import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { updateUser } from "../features/users/usersApiRoutes";
import { useNavigate } from "react-router-dom";
import useLimitLineBreaks from "../hooks/useLimitLineBreaks";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;

const EditProfileInformationForm = ({
  user,
  setDisplayDeleteModal,
  setError,
  setErrorMsg,
  setConfirmation,
  setConfirmationMsg,
}) => {
  const navigate = useNavigate();
  const limitLineBreaks = useLimitLineBreaks();

  const [updatedInfo, setUpdatedInfo] = useState({
    username: user?.username || "",
    fullname: user?.fullname || "",
    userBio: user?.userBio || "",
    website: "Website",
    email: user?.email || "",
  });

  const parseUserBio = (userBioInput) => {
    setUpdatedInfo({
      ...updatedInfo,
      userBio: limitLineBreaks(userBioInput, 5),
    });
  };

  const [usernameClick, setUsernameClick] = useState(false);
  const [usernameSuccess, setUsernameSuccess] = useState(false);

  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      setConfirmation(true);
      setConfirmationMsg("Profile updated");
      if (user?.username === updatedInfo.username) {
        queryClient.setQueryData(["userInfo", user?.username], (oldData) => {
          if (oldData) {
            const updatedData = { ...oldData, ...updatedInfo };
            return updatedData;
          }
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["userInfo", user?.username],
      });
      navigate(`/${updatedInfo.username}`);
    },
  });

  const handleEditUserInformation = (e) => {
    e.preventDefault();
    setError(false);
    setErrorMsg("");
    setConfirmation(false);
    setConfirmationMsg("");
    if (!USER_REGEX.test(updatedInfo.username)) {
      setError(true);
      setErrorMsg("Invalid Username");
      return;
    }
    if (updatedInfo.fullname.length < 3 || updatedInfo.fullname.length > 30) {
      setError(true);
      setErrorMsg("Name must be 3-30 characters");
      return;
    }
    if (updatedInfo.userBio.length > 150) {
      setError(true);
      setErrorMsg("Bio must be less than 150 characters");
      return;
    }
    updateUserMutation.mutate(updatedInfo);
  };

  useEffect(() => {
    if (updateUserMutation.isError) {
      setError(true);
      setErrorMsg(updateUserMutation?.error?.response?.data?.message);
    }
  }, [updateUserMutation.isError]);

  useEffect(() => {
    if (USER_REGEX.test(updatedInfo.username)) {
      setUsernameSuccess(true);
      return;
    }
    setUsernameSuccess(false);
  }, [updatedInfo.username]);

  return (
    <form
      onSubmit={handleEditUserInformation}
      className='flex-container flex-column'
    >
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
            spellCheck='false'
            value={updatedInfo.fullname}
            onChange={(e) =>
              setUpdatedInfo({ ...updatedInfo, fullname: e.target.value })
            }
            aria-label='name'
            aria-describedby='name-information-text'
          />
          <div className='form-information'>
            <span id='name-information-text'>
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
            spellCheck='false'
            id='username-input'
            name='username-input'
            type='text'
            placeholder='username'
            value={updatedInfo.username}
            onChange={(e) =>
              setUpdatedInfo({ ...updatedInfo, username: e.target.value })
            }
            onFocus={() => setUsernameClick(true)}
            onBlur={() => setUsernameClick(false)}
            aria-label='username'
            aria-describedby='usernameNote'
            aria-invalid={!usernameSuccess}
          />
          <div className='form-information'>
            <p
              id='usernameNote'
              className={
                usernameClick && !usernameSuccess && updatedInfo.username.length
                  ? "form-description"
                  : "offscreen"
              }
            >
              4 to 24 characters. <br />
              Must begin with a letter. <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>
            <span id='username-information-text'>
              In most cases, you'll be able to change your username back to
              {user?.username} for another 14 days.
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
            aria-describedby='website-information-text'
          />
          <div className='form-information'>
            <span id='website-information-text'>
              Editing your links is only available on mobile. Visit the
              Instagram app and edit your profile to change the websites in your
              bio.
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
            onChange={(e) => parseUserBio(e.target.value)}
            maxLength='150'
          ></textarea>
          <div className='form-information'>
            {updatedInfo?.userBio?.length} / 150
          </div>
        </div>
      </div>
      <div className='form-row'>
        <div className='form-left'></div>
        <div className='form-right'>
          <div className='form-information personal-information-disclaimer'>
            <h2>Personal Information</h2>
            <span>
              Provide your personal information, even if the account is used for
              a business, a pet or something else. This won't be a part of your
              public profile.
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
        <div className='button-div-right flex-container'>
          <div className='submit-button-div'>
            <button
              type='submit'
              className='submit-button standard-button blue-button'
            >
              Submit
            </button>
          </div>
          <div className='delete-button-div flex-container flex-align-center flex-justify-center'>
            <button
              type='button'
              className='delete-button transparent-button'
              onClick={() => setDisplayDeleteModal(true)}
            >
              Delete my account
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditProfileInformationForm;
