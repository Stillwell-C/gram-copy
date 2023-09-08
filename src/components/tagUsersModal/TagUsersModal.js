import React, { useState } from "react";
import "./tagUsersModal.scss";
import TagUsersSearch from "../TagUsersSearch";
import TaggedUsersDisplay from "../TaggedUsersDisplay";

const TagUsersModal = ({ post, setShowTagUsersModal }) => {
  const [showTaggedUsersDisplay, setShowTaggedUsersDisplay] = useState(false);
  return (
    <>
      <div className='tag-users-modal-container'>
        {!showTaggedUsersDisplay && (
          <TagUsersSearch
            setShowTagUsersModal={setShowTagUsersModal}
            setShowTaggedUsersDisplay={setShowTaggedUsersDisplay}
            post={post}
          />
        )}
        {showTaggedUsersDisplay && (
          <TaggedUsersDisplay
            post={post}
            setShowTagUsersModal={setShowTagUsersModal}
            setShowTaggedUsersDisplay={setShowTaggedUsersDisplay}
          />
        )}
      </div>
      <div
        className='tag-users-modal-overlay'
        aria-label='click to close modal'
        onClick={() => setShowTagUsersModal(false)}
      ></div>
    </>
  );
};

export default TagUsersModal;
