import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    message:"working"
  })
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

  const { username, fullNamefullName, email, password } = req.body;
  console.log("fullName",fullName);
});

export { registerUser };
