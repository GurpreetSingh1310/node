import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

//configuring cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uplaodOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //Upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // console.log("file uploaded on cloudinary", response);
    // response.url();
    fs.unlinkSync(localFilePath);
    return response; //for user
  } catch (err) {
    console.log("Error while uploading file", err);
    fs.unlinkSync(localFilePath); //remove the locally saved temp file as the upload operation got failed
    return null;
  }
};

export { uplaodOnCloudinary };
