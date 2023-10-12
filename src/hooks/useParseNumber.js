const useParseNumber = () => {
  const parseNum = (num) => {
    const parsedNum = parseInt(num);
    if (parsedNum < 10000) {
      return parsedNum;
    }
    if (parsedNum < 1000000) {
      return `${Math.floor(parsedNum / 1000)}K`;
    }
    if (parsedNum < 1000000000) {
      return `${Math.floor(parsedNum / 1000000)}M`;
    }
    if (parsedNum < 1000000000000) {
      return `${Math.floor(parsedNum / 1000000000)}B`;
    }
  };

  return parseNum;
};
export default useParseNumber;
