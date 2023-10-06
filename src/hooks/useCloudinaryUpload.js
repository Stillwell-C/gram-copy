import axios from "axios";
import gramCopyApi from "../app/api/gramCopyApi";
import { useDispatch } from "react-redux";
import { setError, setErrorRefreshPage } from "../features/error/errorSlice";

const api_key = "419818228346469";
const cloud_name = "danscxcd2";

const useCloudinaryUpload = () => {
  const dispatch = useDispatch();

  const uploadImage = async (imageFile) => {
    const signatureResponse = await gramCopyApi.get("/auth/cloud-signature");

    const imgData = new FormData();
    imgData.append("file", imageFile);
    imgData.append("api_key", api_key);
    imgData.append("signature", signatureResponse.data.signature);
    imgData.append("timestamp", signatureResponse.data.timestamp);

    try {
      const cloudinaryRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`,
        imgData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return {
        public_id: cloudinaryRes.data.public_id,
        version: cloudinaryRes.data.version,
        signature: cloudinaryRes.data.signature,
        format: cloudinaryRes.data.format,
      };
    } catch (err) {
      dispatch(setError(true));
      dispatch(setErrorRefreshPage(false));
      return err;
    }
  };

  return uploadImage;
};

export default useCloudinaryUpload;
