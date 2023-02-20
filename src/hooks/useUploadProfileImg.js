import { updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { auth, db, storage } from "../firebase";

const useUploadProfileImg = () => {
  const { currentUser, dispatch } = useContext(AuthContext);

  const uploadFile = async (imgFileUpload) => {
    const fileName =
      new Date().getTime() + currentUser.username + imgFileUpload.name;
    const storageRef = ref(storage, fileName);
    try {
      const user = auth.currentUser;
      const uploadTask = await uploadBytesResumable(storageRef, imgFileUpload);
      const downloadURL = await getDownloadURL(storageRef);
      console.log(uploadTask);
      updateDoc(doc(db, "userInfo", user.uid), {
        userImg: uploadTask.metadata.fullPath,
        userImgURL: downloadURL,
      });
      await updateProfile(user, {
        photoURL: downloadURL,
      });
      dispatch({
        type: "LOGIN",
        payload: {
          ...currentUser,
          userImgURL: downloadURL,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return uploadFile;
};

export default useUploadProfileImg;
