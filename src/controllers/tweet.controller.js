import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const tweet = await Tweet.create({
    content: content,
    owner: req.user?.id,
  });

  if (!tweet) {
    return res.status(404).json(new ApiError(404, "Tweet data is not working"));
  }

//   await tweet.save(); //Saving Tweet

  return res
    .status(201)
    .json(new ApiResponse(201, tweet, "Tweet sent successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const tweetData = await User.find({
    content,
    owner,
  });

  const { tweet } = req.params();
  return res
    .status(200)
    .json(new ApiResponse(200, tweetData, "tweetData sent successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { tweetId, content } = req.body;

  const updatedTweet = await User.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        content: content,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedTweet) {
    return res.status(404).json(new ApiError(404, "Tweet data is not working"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updateTweet, "Success updating Tweet"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.body;
  await User.findByIdAndDelete(tweetId);

  return res.status(200).json(new ApiResponse(200, "Tweet deleted"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
