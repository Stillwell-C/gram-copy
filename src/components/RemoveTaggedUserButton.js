import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { updatePostTaggedUsers } from "../features/posts/postApiRoutes";

const RemoveTaggedUserButton = ({ user, post }) => {
  const queryClient = useQueryClient();

  const taggedUsersWithCurrentUserRemoved = post.taggedUsers.filter(
    (taggedUser) => taggedUser !== user._id
  );

  const removeTaggedUserMutation = useMutation({
    mutationFn: updatePostTaggedUsers,
    onSuccess: () => {
      queryClient.setQueryData(["profilePosts", post.user._id], (oldData) => {
        if (oldData) {
          const data = oldData;
          for (const page of data.pages) {
            for (const pagePost of page.posts) {
              if (pagePost._id === post._id) {
                post.taggedUsers = taggedUsersWithCurrentUserRemoved;
              }
            }
          }
          return data;
        }
      });
      queryClient.invalidateQueries(["taggedUsers", post._id]);
    },
  });

  const handleRemoveTag = () => {
    removeTaggedUserMutation.mutate({
      postID: post._id,
      userID: user._id,
      updateAction: "REMOVE",
    });
  };

  return (
    <button
      aria-label={`click to remove ${user.username} tag from image`}
      onClick={handleRemoveTag}
    >
      Remove
    </button>
  );
};

export default RemoveTaggedUserButton;