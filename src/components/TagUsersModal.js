import React, { useState } from "react";
import "../scss/tagUsersModal.scss";
import TagUsersSearch from "../features/posts/TagUsersSearch";
import TaggedUsersDisplay from "../features/posts/TaggedUsersDisplay";
import FocusTrapModalParent from "./FocusTrapModalParent";

const TagUsersModal = ({ post, setShowTagUsersModal }) => {
  const [showTaggedUsersDisplay, setShowTaggedUsersDisplay] = useState(false);

  const handleClose = () => {
    setShowTagUsersModal(false);
  };

  const content = (
    <div className='tag-users-modal-container modal-body'>
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
  );

  return (
    <FocusTrapModalParent
      content={content}
      handleClose={handleClose}
      showClose={false}
    />
  );
};

export default TagUsersModal;
