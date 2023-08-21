import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { updateUser } from "../features/users/usersApiRoutes";

const RemoveTaggedUserButton = ({ user, post }) => {
  const queryClient = useQueryClient();

  const taggedUsersWithCurrentUserRemoved = post.taggedUsers.filter(
    (taggedUser) => taggedUser !== user._id
  );

  const removeTaggedUserMutation = useMutation({
    mutationFn: updateUser,
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
    },
  });

  const handleRemoveTag = () => {
    removeTaggedUserMutation.mutate({
      userID: user._id,
      taggedUsers: taggedUsersWithCurrentUserRemoved,
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
