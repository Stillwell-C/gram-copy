import EditPostInformationForm from "./EditPostInformationForm";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useQuery } from "react-query";
import { getPost } from "./postApiRoutes";
import { useEffect } from "react";
import { setLoading } from "../display/displaySlice";

import "../../scss/createAndEditPost.scss";

const EditPostPage = () => {
  const { postID } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const queryKey = ["singlePost", postID];

  const {
    data: postData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: queryKey,
    enabled: !!postID,
    queryFn: () => getPost(postID),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isLoading) {
      dispatch(setLoading(true));
      return;
    }
    dispatch(setLoading(false));
  }, [isLoading, postID]);

  useEffect(() => {
    if (isError && error?.response?.status === 400) {
      navigate("/error", {
        replace: true,
        state: {
          errorTitle: "Page not found.",
          errorMessage:
            "The link you followed may be broken, or the page may have been removed.",
          errorCode: error?.status,
        },
      });
    }
    if (isError) {
      navigate("/error", {
        replace: true,
        state: {
          errorCode: error?.response?.status,
        },
      });
    }
  }, [isError]);

  return (
    <div className='flex-container fg-1 flex-align-center flex-justify-center padding-1'>
      {postData?._id && <EditPostInformationForm post={postData} />}
    </div>
  );
};

export default EditPostPage;
