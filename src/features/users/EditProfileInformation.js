import React, { useEffect, useRef, useState } from "react";
import DeleteAccountModal from "./DeleteAccountModal";
import { useDispatch } from "react-redux";
import EditProfileInformationForm from "./EditProfileInformationForm";
import EditProfileInformationImage from "../../components/EditProfileInformationImage";
import { useQuery } from "react-query";
import { getUserData } from "./usersApiRoutes";
import { setLoading } from "../display/displaySlice";
import useAuth from "../../hooks/useAuth";

const EditProfileInformation = () => {
  const { username } = useAuth();
  const dispatch = useDispatch();

  const errRef = useRef();
  const successRef = useRef();

  const [displayDeleteModal, setDisplayDeleteModal] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const [confirmationMsg, setConfirmationMsg] = useState("");

  const {
    data: userData,
    isLoading,
    isError,
    error: userDataError,
  } = useQuery({
    queryKey: ["personalUserData", username],
    enabled: !!username,
    queryFn: getUserData,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isLoading) {
      dispatch(setLoading(true));
      return;
    }
    dispatch(setLoading(false));
  }, [isLoading, username]);

  useEffect(() => {
    if (isError || error) {
      if (isError) {
        setErrorMsg(
          userDataError?.response?.data?.message ||
            "An error occurred. Please try again."
        );
      }
      errRef?.current?.focus();
    }
  }, [isError || error]);

  useEffect(() => {
    if (confirmation) {
      successRef.current.focus();
    }
  }, [confirmation]);

  return (
    <div className='edit-profile-information-container flex-container flex-column flex-justify-center flex-align-start'>
      {error && (
        <div className='user-error-div' ref={errRef}>
          <span className='error-msg'>{errorMsg}</span>
        </div>
      )}
      {confirmation && (
        <div className='user-confirmation-div' ref={successRef}>
          <span className='confirmation-msg'>{confirmationMsg}</span>
        </div>
      )}
      {!isLoading && (
        <EditProfileInformationImage
          user={userData}
          setError={setError}
          setErrorMsg={setErrorMsg}
          setConfirmation={setConfirmation}
          setConfirmationMsg={setConfirmationMsg}
        />
      )}
      {!isLoading && (
        <EditProfileInformationForm
          user={userData}
          setDisplayDeleteModal={setDisplayDeleteModal}
          setError={setError}
          setErrorMsg={setErrorMsg}
          setConfirmation={setConfirmation}
          setConfirmationMsg={setConfirmationMsg}
        />
      )}
      {displayDeleteModal && (
        <DeleteAccountModal setDisplayDeleteModal={setDisplayDeleteModal} />
      )}
    </div>
  );
};

export default EditProfileInformation;
