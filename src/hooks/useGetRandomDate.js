import { useEffect } from "react";

//This is to generate random dates when populating website with user posts
//Not intended for use in final build.
const useGetRandomDate = () => {
  const getRandomDate = (startDate, endDate) => {
    const minValue = startDate.getTime();
    const maxValue = endDate.getTime();
    const timestamp = Math.floor(
      Math.random() * (maxValue - minValue + 1) + minValue
    );
    return new Date(timestamp);
  };

  return getRandomDate(new Date(2021, 0, 1), new Date());
};

export default useGetRandomDate;
