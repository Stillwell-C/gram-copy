import React from "react";
import { Link } from "react-router-dom";

const useParseTextForLinks = () => {
  const parseTextForLinks = (textInput, maxLength, abbreviate = false) => {
    const hashtagRegex = /#(\w+)/;
    const atRegex = /@(\w+)/;
    const commentLines = textInput.split("\n").slice(0, maxLength);
    const parsedText = commentLines.map((line) => {
      const lineWords = line.split(" ");
      return lineWords.map((fragment, i) => {
        const key = `${fragment}-${i}`;
        let parsedFragment = fragment;
        if (hashtagRegex.test(fragment)) {
          parsedFragment = (
            <Link to={`/search/hash/${fragment.substring(1)}`}>{fragment}</Link>
          );
        }
        if (atRegex.test(fragment)) {
          parsedFragment = (
            <Link to={`/${fragment.substring(1)}`}>{fragment}</Link>
          );
        }
        const spaceOrBreak = i + 1 === lineWords.length ? <br /> : " ";
        return (
          <React.Fragment key={key}>
            {parsedFragment}
            {spaceOrBreak}
          </React.Fragment>
        );
      });
    });
    return (
      <span className='comment-body'>
        {parsedText}
        {abbreviate && textInput.split("\n").length > maxLength && <>...</>}
      </span>
    );
  };

  return parseTextForLinks;
};

export default useParseTextForLinks;
