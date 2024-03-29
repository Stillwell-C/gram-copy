import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";

import useCloudinaryUpload from "../../hooks/useCloudinaryUpload";
import { updateUser } from "./usersApiRoutes";

import DefaultUserImg from "../../assets/Default_pfp.svg";

const EditProfileInformationImage = ({
  user,
  setError,
  setErrorMsg,
  setConfirmation,
  setConfirmationMsg,
}) => {
  const [userImgURL, setUserImgURL] = useState(DefaultUserImg);
  const [newUserImgKey, setNewUserImgKey] = useState(null);

  useEffect(() => {
    setUserImgURL(
      `https://res.cloudinary.com/danscxcd2/image/upload/w_90,c_fill/${user?.userImgKey}`
    );
  }, [user]);

  const imgInputRef = useRef(null);
  const btnInputRef = useRef(null);
  const cloudinaryUpload = useCloudinaryUpload();
  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      setConfirmation(true);
      setConfirmationMsg("Profile image updated");
      queryClient.setQueryData(["userInfo", user?.username], (oldData) => {
        if (oldData) {
          const data = oldData;
          if (newUserImgKey) data.userImgKey = newUserImgKey;
          return data;
        }
      });
      queryClient.invalidateQueries({
        queryKey: ["userInfo", user?.username],
      });
    },
  });

  const handleImgUpload = async (e) => {
    e.preventDefault();
    setError(false);
    setErrorMsg("");
    setConfirmation(false);
    setConfirmationMsg("");
    if (e.target.files && e.target.files[0]) {
      setUserImgURL(URL.createObjectURL(e.target.files[0]));
      const cloudinaryResponse = await cloudinaryUpload(e.target.files[0]);
      setNewUserImgKey(
        `${cloudinaryResponse.public_id}.${cloudinaryResponse.format}`
      );
      updateUserMutation.mutate({
        userImgKey: `${cloudinaryResponse.public_id}.${cloudinaryResponse.format}`,
      });
    }
  };

  useEffect(() => {
    if (updateUserMutation.isError) {
      setError(true);
      setErrorMsg(updateUserMutation.error.response.data.message);
    }
  }, [updateUserMutation.isError]);

  return (
    <>
      <div className='user-info flex-container'>
        <div className='profile-img-div flex-container flex-align-center flex-justify-center'>
          <button
            title='Click to change profile picture'
            aria-label='change profile photo'
            onClick={() => imgInputRef.current.click()}
            className='transparent-button'
          >
            <img
              src={userImgURL}
              alt='user profile upload'
              aria-hidden='true'
              className='circular-image'
            />
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
        <div className='user-info-right flex-container height-100 flex-column flex-justify-center'>
          <div className='username'>{user?.username}</div>
          <button
            aria-label='change profile photo'
            onClick={() => btnInputRef.current.click()}
            className='transparent-button'
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
    </>
  );
};

export default EditProfileInformationImage;
