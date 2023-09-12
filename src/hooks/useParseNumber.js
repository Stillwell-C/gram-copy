const useParseNumber = () => {
  const parseNum = (num) => {
    if (num < 10000) {
      return num;
    }
    if (num < 1000000) {
      return `${Math.floor(num / 1000)}K`;
    }
    if (num < 1000000000) {
      return `${Math.floor(num / 1000000)}M`;
    }
    if (num < 1000000000000) {
      return `${Math.floor(num / 1000000000)}B`;
    }
  };

  return parseNum;
};
export default useParseNumber;
