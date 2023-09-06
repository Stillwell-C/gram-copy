import React, { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { getNotifications } from "../features/notifications/notificationsApiRoutes";
import { useNavigate } from "react-router-dom";
import Notification from "./Notification";
import addNotificationsIcon from "../assets/add-circle-svgrepo-com.svg";
import { FadeLoader } from "react-spinners";
import "../scss/notification.scss";

const NotificationsPage = () => {
  const navigate = useNavigate();

  const notificationsLoadLimit = 10;

  const {
    data: notificationsData,
    isLoading,
    isError,
    error,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam = 1 }) =>
      getNotifications({
        pageParam,
        limit: notificationsLoadLimit,
      }),
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, pages) => {
      console.log(lastPage);
      if (lastPage.page < lastPage.totalPages)
        return parseInt(lastPage.page) + 1;
      return false;
    },
  });

  useEffect(() => {
    if (isError && error?.response?.status !== 400) navigate("/error");
  }, [isError]);

  useEffect(() => {
    console.log(hasNextPage);
  }, [hasNextPage]);

  const flattenedData = notificationsData?.pages?.reduce((acc, page) => {
    return [...acc, ...page?.notifications];
  }, []);

  const content = flattenedData?.map((notification) => {
    return <Notification key={notification._id} notification={notification} />;
  });

  return (
    <div className='flex-container fg-1 flex-column flex-align-center margin-top-3 gap-2'>
      <h2>Notifications</h2>
      {content}
      {isError && error?.response?.data?.message}
      {(isLoading || isFetching) && (
        <FadeLoader
          cssOverride={{ alignSelf: "center", scale: "0.5" }}
          color='#333'
        />
      )}
      {hasNextPage && !isLoading && !isFetching && (
        <div className='add-notifications-button-div'>
          <button
            type='button'
            aria-label='show more comments'
            onClick={fetchNextPage}
          >
            <img src={addNotificationsIcon} alt='' aria-hidden='true' />
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
