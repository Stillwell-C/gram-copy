import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";

import SinglePost from "../../components/SinglePost";
import { getPost } from "./postApiRoutes";
import { setLoading } from "../display/displaySlice";

import "../../scss/singlePostPage.scss";

const SinglePostPage = () => {
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
    } else if (isError) {
      navigate("/error", {
        replace: true,
        state: {
          errorCode: error?.response?.status,
        },
      });
    }
  }, [isError]);

  return (
    <div className='single-post-page flex-container flex-align-center'>
      <div className='single-post-container'>
        {postData?._id && <SinglePost post={postData} queryKey={queryKey} />}
      </div>
    </div>
  );
};

export default SinglePostPage;
