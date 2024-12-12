import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = Schema(
  {
    videoFile: {
      type: String, // from cloudinary URL
      required: true,
    },
    thumbnail: {
      type: String, // from cloudinary URL
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // From cloudinary
      required: true,
    },
    views: {
      type: Number,
      default: 0,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

videoSchema.plugin(mongooseAggregatePaginate);
export const Video = mongoose.model("Video", videoSchema);
