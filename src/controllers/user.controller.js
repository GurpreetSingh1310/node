import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uplaodOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "working",
  });
  /*
+++++++++++++ Checks to be performed while registering user +++++++++++++

*) get user details from frontend
*) validation - not 
*) check if user already exists: username or email
*) upload them to cloudinary, avatar
*) create user object - create entry in db
*) remove password and refresh token field from response
*) check for user creation
*) return res

+++++++++++++ Checks to be performed while registering user +++++++++++++
*/

  const { username, fullName, email, password } = req.body;
  console.log("fullName", fullName);
  //Checking empty fields if any

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All Fields are required");
  }

  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uplaodOnCloudinary(avatarLocalPath);
  const coverImage = await uplaodOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    password,
    username: username.toLowerCase(),
    email,
  });

  const createdUser = User.findById(user._id).select("-password -refreshToken");
  // .select() is used when we don't want to add specific field to run
  // in this case .select() is preventing two field to be searched

  if (!createdUser) {
    throw new ApiError(500, "register User doesn't exist");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

export { registerUser };

/* 
console.log(req.body);
console.log(req.files);
*/
