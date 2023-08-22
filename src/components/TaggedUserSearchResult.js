import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { updatePostTaggedUsers } from "../features/posts/postApiRoutes";

const TaggedUserSearchResult = React.forwardRef(
  ({ user, post, selectedUser, setSelectedUser }, ref) => {
    const userImgURL = `https://res.cloudinary.com/danscxcd2/image/upload/w_150,c_fill/${user.userImgKey}`;

    const queryClient = useQueryClient();

    const taggedUsersWithCurrentUser = [...post.taggedUsers, user._id];

    const addTaggedUserMutation = useMutation({
      mutationFn: updatePostTaggedUsers,
      onSuccess: () => {
        setSelectedUser(null);
        queryClient.setQueryData(["profilePosts", post.user._id], (oldData) => {
          if (oldData) {
            const data = oldData;
            for (const page of data.pages) {
              for (const pagePost of page.posts) {
                if (pagePost._id === post._id) {
                  post.taggedUsers = taggedUsersWithCurrentUser;
                }
              }
            }
            return data;
          }
        });
      },
    });

    const handleAddTag = () => {
      addTaggedUserMutation.mutate({
        userID: user._id,
        postID: post._id,
        updateAction: "ADD",
      });
    };

    return (
      <div
        className={`search-result ${
          user._id === selectedUser?._id && "highlight"
        }`}
        onClick={() => setSelectedUser(user)}
      >
        <div className='profile-picture'>
          <img src={userImgURL} alt='user profile' />
        </div>
        <div className='right-display'>
          <div className='userinfo-div'>
            <div className='username'>{user.username}</div>
            <div className='fullname'>{user.fullname}</div>
          </div>
          {user._id === selectedUser?._id && (
            <div className='button-div'>
              <button
                aria-label={`tag ${user.username} in image`}
                onClick={handleAddTag}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default TaggedUserSearchResult;
