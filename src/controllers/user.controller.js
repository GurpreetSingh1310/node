import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uplaodOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//Generating Access & Refresh Token
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken; //Adding toke to the user
    await user.save({ validateBeforeSave: false }); //saving user

    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(
      500,
      "Somethiing went wrond while generation Access and Refresh Token"
    );
  }
};

//Registering User
const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "Db working",
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
  // console.log("fullName", fullName);
  //Checking empty fields if any

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All Fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0];
  }

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
  console.log("user", user);
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

//Logging in User
const loginUser = asyncHandler(async (req, res) => {
  /*

  -> req body -> data
  -> take username
  -> find in db
  ->if matches (Render login page) else error
 -> password check
 -> access and refresh token
 -> send cookie

  */

  const { email, password, username } = req.body;
  if (!username || !email) {
    throw new ApiError(400, "Username or email is required");
  }

  //Finding user form DB
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "User Not Found!!!");
  }

  //Validating Password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Password Incorrect");
  }

  const { refreshToken, accessToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //Sending Cookies
  const options = {
    httpOnly: true,
    secure: true,
  };
  return (
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options),
    json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In successfully"
      )
    )
  );
});

const logoutUser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out Successfully"));
});
 
export { registerUser, loginUser, logoutUser };

