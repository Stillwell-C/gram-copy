import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { updateUser } from "../features/users/usersApiRoutes";

const EditProfileInformationForm = ({
  user,
  setDisplayDeleteModal,
  setError,
  setErrorMsg,
  setConfirmation,
  setConfirmationMsg,
}) => {
  const [updatedInfo, setUpdatedInfo] = useState({
    username: user?.username || "",
    fullname: user?.fullname || "",
    userBio: user?.userBio || "",
    website: "Website",
    email: user?.email || "",
    id: user?._id,
  });

  const parseUserBio = (userBioInput) => {
    console.log(userBioInput);
    console.log((userBioInput.match(/\n/g) || []).length);
    console.log(userBioInput.slice(-2) === "\n");
    if ((userBioInput.match(/\n/g) || []).length >= 3) {
      const splitBio = userBioInput.split("\n");
      console.log("split ", splitBio);
      const topThreeLines = splitBio.slice(0, 3).join("\n");
      console.log("top ", topThreeLines);
      const remainingLines = splitBio.slice(3).join(" ");
      console.log("rem ", remainingLines);

      setUpdatedInfo({
        ...updatedInfo,
        userBio: `${topThreeLines} ${remainingLines}`,
      });
      return;
    }
    setUpdatedInfo({
      ...updatedInfo,
      userBio: userBioInput,
    });
  };

  const [usernameClick, setUsernameClick] = useState(false);

  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      setConfirmation(true);
      setConfirmationMsg("Profile updated");
      queryClient.setQueryData(["userInfo", user?.username], (oldData) => {
        if (oldData) {
          const updatedData = { ...oldData, ...updatedInfo };
          return updatedData;
        }
      });
      queryClient.invalidateQueries({
        queryKey: ["userInfo", user?.username],
      });
    },
  });

  const handleEditUserInformation = (e) => {
    e.preventDefault();
    setError(false);
    setErrorMsg("");
    setConfirmation(false);
    setConfirmationMsg("");
    if (updatedInfo.username.length < 3 || updatedInfo.username.length > 30) {
      setError(true);
      setErrorMsg("Username must be 3-30 characters");
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
      setErrorMsg(updateUserMutation.error.response.data.message);
    }
  }, [updateUserMutation.isError]);

  return (
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
          />
          <div className='form-information'>
            <p
              id='usernameNote'
              className={
                usernameClick && updatedInfo.username.length
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
  );
};

export default EditProfileInformationForm;
