import React, { useEffect, useRef, useState } from "react";
import useCloudinaryUpload from "../hooks/useCloudinaryUpload";
import { updateUser } from "../features/users/usersApiRoutes";
import { useMutation, useQueryClient } from "react-query";
import DefaultUserImg from "../assets/Default_pfp.svg";

const ProfileUserImage = ({ user, displayOwnPage }) => {
  const [userImgURL, setUserImgURL] = useState(DefaultUserImg);
  const [newUserImgKey, setNewUserImgKey] = useState(null);

  useEffect(() => {
    if (!user?.userImgKey) return;
    setUserImgURL(
      `https://res.cloudinary.com/danscxcd2/image/upload/w_150,c_fill/${user?.userImgKey}`
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
  });

  const handleImgUpload = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setUserImgURL(URL.createObjectURL(e.target.files[0]));
      const cloudinaryResponse = await cloudinaryUpload(e.target.files[0]);
      setNewUserImgKey(
        `${cloudinaryResponse.public_id}.${cloudinaryResponse.format}`
      );
      updateUserMutation.mutate({
        userID: user._id,
        userImgKey: `${cloudinaryResponse.public_id}.${cloudinaryResponse.format}`,
      });
    }
  };

  const handleImgClick = () => {
    imgInputRef.current.click();
  };

  const userImg = (
    <picture className='user-img-picture'>
      <source
        srcSet={`https://res.cloudinary.com/danscxcd2/image/upload/w_175,c_fill/${user?.userImgKey}`}
        media='(min-width:768px)'
        alt='user profile'
      />
      <source
        srcSet={`https://res.cloudinary.com/danscxcd2/image/upload/w_95,c_fill/${user?.userImgKey}`}
        alt='user profile'
      />
      <img src={userImgURL} alt='user profile' />
    </picture>
  );

  const profileImg = displayOwnPage ? (
    <div className='profile-img-div'>
      <button
        title='Click to change profile picture'
        aria-label='click to change profile photo'
        onClick={handleImgClick}
      >
        {userImg}
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
  ) : (
    <div className='profile-img-div'>{userImg}</div>
  );

  return profileImg;
};

export default ProfileUserImage;
