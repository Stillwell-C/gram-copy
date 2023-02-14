import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const useAddComment = () => {
  const addComment = async (username, comment, post) => {
    await updateDoc(doc(db, "userImgs", post.id), {
      comments: arrayUnion({
        username: username,
        comment: comment,
        date: new Date().toUTCString(),
      }),
    });
  };

  return addComment;
};

export default useAddComment;
