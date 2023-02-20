import { model, Schema } from 'mongoose';

export interface TweetModelInterface {
  _id?: string;
  text: string;
  user: string;
  images?: string[];
}

const TweetSchema = new Schema(
  {
    text: {
      required: true,
      type: String,
      maxlength: 280,
    },
    user: {
      required: true,
      ref: 'User',
      type: Schema.Types.ObjectId,
    },
    images: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const TweetModel = model('Tweet', TweetSchema);
