import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";

import useCloudinaryUpload from "../../hooks/useCloudinaryUpload";
import { updateUser } from "./usersApiRoutes";
import { setError, setErrorRefreshPage } from "../error/errorSlice";

import DefaultUserImg from "../../assets/Default_pfp.svg";

const ProfileUserImage = ({ user, displayOwnPage }) => {
  const [userImgSmall, setUserImgSmall] = useState("");
  const [userImgMedium, setUserImgMedium] = useState("");
  const [userImgLarge, setUserImgLarge] = useState("");
  const [newUserImgKey, setNewUserImgKey] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!user?.userImgKey) {
      setUserImgSmall(DefaultUserImg);
      setUserImgMedium(DefaultUserImg);
      setUserImgLarge(DefaultUserImg);
    }
    setUserImgSmall(
      `https://res.cloudinary.com/danscxcd2/image/upload/w_150,c_fill/${user?.userImgKey}`
    );
    setUserImgMedium(
      `https://res.cloudinary.com/danscxcd2/image/upload/w_250,c_fill/${user?.userImgKey}`
    );
    setUserImgLarge(
      `https://res.cloudinary.com/danscxcd2/image/upload/w_350,c_fill/${user?.userImgKey}`
    );
  }, [user]);

  const imgInputRef = useRef(null);
  const cloudinaryUpload = useCloudinaryUpload();
  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.setQueryData(["userInfo", user.username], (oldData) => {
        const data = oldData;
        if (newUserImgKey) data.userImgKey = newUserImgKey;
        return data;
      });
      queryClient.invalidateQueries({
        queryKey: ["userInfo", user.username],
      });
    },
    onError: () => {
      dispatch(setError(true));
      dispatch(setErrorRefreshPage(false));
    },
  });

  const handleImgUpload = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const cloudinaryResponse = await cloudinaryUpload(e.target.files[0]);
      setNewUserImgKey(
        `${cloudinaryResponse.public_id}.${cloudinaryResponse.format}`
      );
      updateUserMutation.mutate({
        userID: user._id,
        userImgKey: `${cloudinaryResponse.public_id}.${cloudinaryResponse.format}`,
      });
      setUserImgSmall(URL.createObjectURL(e.target.files[0]));
      setUserImgMedium(URL.createObjectURL(e.target.files[0]));
      setUserImgLarge(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleImgClick = () => {
    imgInputRef.current.click();
  };

  const userImg = (
    <img
      src={userImgLarge}
      alt='user profile'
      className='circular-image user-profile-img'
      srcSet={`${userImgSmall} 150w, ${userImgMedium} 250w, ${userImgLarge} 350w`}
      sizes='(max-width: 349px) 150px, (max-width: 647px) 250px, 350px'
    />
  );

  const profileImg = displayOwnPage ? (
    <div className='profile-img-div'>
      <button
        title='Click to change profile picture'
        aria-label='click to change profile photo'
        onClick={handleImgClick}
        className='transparent-button'
      >
        {userImg}
      </button>
      <form aria-hidden='true'>
        <input
          type='file'
          className='file-upload-input'
          accept='image/png, image/jpeg'
          ref={imgInputRef}
          onChange={handleImgUpload}
        />
      </form>
    </div>
  ) : (
    <div className='profile-img-div'>{userImg}</div>
  );

  return profileImg;
};

export default ProfileUserImage;
