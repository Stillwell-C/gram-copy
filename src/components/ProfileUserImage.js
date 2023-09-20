import React, { useEffect, useRef, useState } from "react";
import useCloudinaryUpload from "../hooks/useCloudinaryUpload";
import { updateUser } from "../features/users/usersApiRoutes";
import { useMutation, useQueryClient } from "react-query";
import DefaultUserImg from "../assets/Default_pfp.svg";

const ProfileUserImage = ({ user, displayOwnPage }) => {
  const [userImgSmall, setUserImgSmall] = useState(
    `https://res.cloudinary.com/danscxcd2/image/upload/w_150,c_fill/${user?.userImgKey}`
  );
  const [userImgMedium, setUserImgMedium] = useState(
    `https://res.cloudinary.com/danscxcd2/image/upload/w_250,c_fill/${user?.userImgKey}`
  );
  const [userImgLarge, setUserImgLarge] = useState(
    `https://res.cloudinary.com/danscxcd2/image/upload/w_350,c_fill/${user?.userImgKey}`
  );
  const [newUserImgKey, setNewUserImgKey] = useState(null);

  useEffect(() => {
    if (!user?.userImgKey) {
      setUserImgSmall(DefaultUserImg);
      setUserImgMedium(DefaultUserImg);
      setUserImgLarge(DefaultUserImg);
    }
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
      const cloudinaryResponse = await cloudinaryUpload(e.target.files[0]);
      setNewUserImgKey(
        `${cloudinaryResponse.public_id}.${cloudinaryResponse.format}`
      );
      updateUserMutation.mutate({
        userID: user._id,
        userImgKey: `${cloudinaryResponse.public_id}.${cloudinaryResponse.format}`,
      });
      setUserImgSmall(URL.createObjectURL(e.target.files[0]));
      setUserImgLarge(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleImgClick = () => {
    imgInputRef.current.click();
  };

  const userImg = (
    // <picture className='user-img-picture'>
    //   <source
    //     srcSet={userImgLarge}
    //     media='(min-width:768px)'
    //     alt='user profile'
    //   />
    //   <source srcSet={userImgSmall} alt='user profile' />
    //   <img
    //     src={userImgLarge}
    //     alt='user profile'
    //     className='circular-image user-profile-img'
    //   />
    // </picture>
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
