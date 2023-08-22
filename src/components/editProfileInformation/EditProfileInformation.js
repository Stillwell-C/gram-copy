import React, { useEffect, useState } from "react";
import DeleteAccountModal from "../deleteAccountModal/DeleteAccountModal";
import "./editProfileInformation.scss";
import { useDispatch } from "react-redux";
import EditProfileInformationForm from "../EditProfileInformationForm";
import EditProfileInformationImage from "../EditProfileInformationImage";
import { useQuery } from "react-query";
import { getUser } from "../../features/users/usersApiRoutes";
import { setLoading } from "../../features/display/displaySlice";
import useAuth from "../../hooks/useAuth";

const EditProfileInformation = () => {
  const { username } = useAuth();
  const dispatch = useDispatch();

  const {
    data: userData,
    isLoading,
    isError,
    error: userDataError,
  } = useQuery({
    queryKey: ["userInfo", username],
    enabled: !!username,
    queryFn: () => getUser(username),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isLoading) {
      dispatch(setLoading(true));
      return;
    }
    dispatch(setLoading(false));
    console.log(userData);
  }, [isLoading, username]);

  const [displayDeleteModal, setDisplayDeleteModal] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState([]);
  const [confirmation, setConfirmation] = useState(false);
  const [confirmationMsg, setConfirmationMsg] = useState([]);

  return (
    <div className='edit-profile-information-container'>
      <div
        className={
          error || confirmation ? "user-msg-div active" : "user-msg-div"
        }
      >
        <div className={error ? "user-error-div active" : "user-error-div"}>
          {<span className='error-msg'>{errorMsg}</span>}
        </div>
        <div
          className={
            confirmation
              ? "user-confirmation-div active"
              : "user-confirmation-div"
          }
        >
          {<span className='confirmation-msg'>{confirmationMsg}</span>}
        </div>
      </div>
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
