import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable } from "firebase/storage";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { db, getURL, storage } from "../firebase";

const useUploadProfileImg = () => {
  const { currentUser } = useContext(AuthContext);

  const uploadFile = async (imgFileUpload) => {
    const fileName =
      new Date().getTime() + currentUser.username + imgFileUpload.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imgFileUpload);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (err) => {
        console.log(err.code);
      },
      () => {
        updateDoc(doc(db, "userInfo", currentUser.userInfoID), {
          userImg: uploadTask.snapshot.metadata.fullPath,
        }).catch((err) => {
          console.log(err.message);
          console.log(err.code);
        });
      }
    );
  };

  return uploadFile;
};

export default useUploadProfileImg;
