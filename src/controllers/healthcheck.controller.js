import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthcheck = asyncHandler(async (req, res) => {
  try {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Everything is working good"));
  } catch (error) {
    return res
      .status(408)
      .json(new ApiError(408, error?.message || "Health is not good "));
  }
});

export { healthcheck };
