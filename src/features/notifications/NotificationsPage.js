import React, { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { useDispatch } from "react-redux";

import { getNotifications } from "./notificationsApiRoutes";
import Notification from "../../components/Notification";
import addNotificationsIcon from "../../assets/add-circle-svgrepo-com.svg";
import Footer from "../../components/Footer";
import FadeLoaderStyled from "../../components/FadeLoaderStyled";
import { setError, setErrorRefreshPage } from "../error/errorSlice";

import "../../scss/notification.scss";

const NotificationsPage = () => {
  const dispatch = useDispatch();

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
      if (lastPage.page < lastPage.totalPages)
        return parseInt(lastPage.page) + 1;
      return false;
    },
  });

  useEffect(() => {
    if (isError && error?.response?.status !== 400) {
      dispatch(setError(true));
      dispatch(setErrorRefreshPage(false));
    }
  }, [isError]);

  const flattenedData = notificationsData?.pages?.reduce((acc, page) => {
    if (!page?.notifications?.length) return acc;

    return [...acc, ...page?.notifications];
  }, []);

  const content = flattenedData?.map((notification) => {
    return <Notification key={notification._id} notification={notification} />;
  });

  return (
    <div className='flex-container flex-column flex-align-center notifications-page width-100'>
      <div className='notifications-container flex-container flex-column'>
        <div className='header-div width-100'>
          <h2 className='margin-btm-1'>Notifications</h2>
        </div>
        <div className='notifications-content width-100 flex-container flex-column gap-2'>
          {content}
          {isError && error?.response?.data?.message}
          {(isLoading || isFetching) && <FadeLoaderStyled />}
          {hasNextPage && !isLoading && !isFetching && (
            <div className='add-notifications-button-div width-100 flex-container flex-justify-center'>
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
      </div>
      <div className='footer-container'>
        <Footer />
      </div>
    </div>
  );
};

export default NotificationsPage;
