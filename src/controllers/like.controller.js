// import mongoose, {isValidObjectId} from "mongoose"
// import {Like} from "../models/like.model.js"
// import {ApiError} from "../utils/ApiError.js"
// import {ApiResponse} from "../utils/ApiResponse.js"
// import {asyncHandler} from "../utils/asyncHandler.js"

// const toggleVideoLike = asyncHandler(async (req, res) => {
//     const {videoId} = req.params
//     //TODO: toggle like on video
// })

// const toggleCommentLike = asyncHandler(async (req, res) => {
//     const {commentId} = req.params
//     //TODO: toggle like on comment

// })

// const toggleTweetLike = asyncHandler(async (req, res) => {
//     const {tweetId} = req.params
//     //TODO: toggle like on tweet
// }
// )

// const getLikedVideos = asyncHandler(async (req, res) => {
//     //TODO: get all liked videos
// })

// export {
//     toggleCommentLike,
//     toggleTweetLike,
//     toggleVideoLike,
//     getLikedVideos
// }



import mongoose, { isValidObjectId } from "mongoose";
import { likeModel } from "../models/like.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    if (!isValidObjectId(videoId)) {
        return res.status(400).json(new ApiResponse(400, "Invalid video ID"));
    }

    const like = await likeModel.findOne({ video: videoId, likedBy: userId });
    if (like) {
        await likeModel.findByIdAndDelete(like._id);
        return res.status(200).json(new ApiResponse(200, "Video unliked successfully"));
    } else {
        await likeModel.create({ video: videoId, likedBy: userId });
        return res.status(200).json(new ApiResponse(200, "Video liked successfully"));
    }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    if (!isValidObjectId(commentId)) {
        return res.status(400).json(new ApiResponse(400, "Invalid comment ID"));
    }

    const like = await likeModel.findOne({ comment: commentId, likedBy: userId });
    if (like) {
        await likeModel.findByIdAndDelete(like._id);
        return res.status(200).json(new ApiResponse(200, "Comment unliked successfully"));
    } else {
        await likeModel.create({ comment: commentId, likedBy: userId });
        return res.status(200).json(new ApiResponse(200, "Comment liked successfully"));
    }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user._id;

    if (!isValidObjectId(tweetId)) {
        return res.status(400).json(new ApiResponse(400, "Invalid tweet ID"));
    }

    const like = await likeModel.findOne({ tweet: tweetId, likedBy: userId });
    if (like) {
        await likeModel.findByIdAndDelete(like._id);
        return res.status(200).json(new ApiResponse(200, "Tweet unliked successfully"));
    } else {
        await likeModel.create({ tweet: tweetId, likedBy: userId });
        return res.status(200).json(new ApiResponse(200, "Tweet liked successfully"));
    }
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const likedVideos = await likeModel.aggregate([
        { $match: { likedBy: mongoose.Types.ObjectId(userId), video: { $exists: true } } },
        { $lookup: { from: 'videos', localField: 'video', foreignField: '_id', as: 'videoDetails' } },
        { $unwind: '$videoDetails' },
        { $project: { 'videoDetails.owner.password': 0 } }
    ]);

    return res.status(200).json(new ApiResponse(200, "Liked videos fetched successfully", likedVideos));
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
};