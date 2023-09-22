const useLimitLineBreaks = () => {
  const limitLineBreaks = (text, maxLineBreaks) => {
    if ((text.match(/\n/g) || []).length >= maxLineBreaks) {
      return text.split("\n").slice(0, maxLineBreaks).join("\n");
    }

    return text;
  };
  return limitLineBreaks;
};

export default useLimitLineBreaks;
