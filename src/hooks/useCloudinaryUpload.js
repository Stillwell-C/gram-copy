import axios from "axios";
import gramCopyApi from "../app/api/gramCopyApi";

const api_key = "419818228346469";
const cloud_name = "danscxcd2";

const useCloudinaryUpload = () => {
  const uploadImage = async (imageFile) => {
    const signatureResponse = await gramCopyApi.get("/auth/cloud-signature");

    const imgData = new FormData();
    imgData.append("file", imageFile);
    imgData.append("api_key", api_key);
    imgData.append("signature", signatureResponse.data.signature);
    imgData.append("timestamp", signatureResponse.data.timestamp);

    console.log(imgData);

    try {
      const cloudinaryRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`,
        imgData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          //Remove for production
          onUploadProgress: function (e) {
            console.log(e.loaded / e.total);
          },
        }
      );

      console.log(cloudinaryRes);

      return {
        public_id: cloudinaryRes.data.public_id,
        version: cloudinaryRes.data.version,
        signature: cloudinaryRes.data.signature,
        format: cloudinaryRes.data.format,
      };
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  return uploadImage;
};

export default useCloudinaryUpload;
