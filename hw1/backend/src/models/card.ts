import type { CardData } from "@lib/shared_types";
import mongoose from "mongoose";
import { Types } from "mongoose";

// In `CardData`, we have `list_id` and `id` as a string, but in the database, we want to store them as an ObjectId.
interface CardDocument
  extends Omit<CardData, "id" | "list_id">,
    mongoose.Document {
  list_id: Types.ObjectId;
  moods_id: Types.ObjectId;
  tags_id: Types.ObjectId;
}

interface CardModel extends mongoose.Model<CardDocument> {}

// We enforce the type by adding `<CardDocument>` after `mongoose.Schema`.
const CardSchema = new mongoose.Schema<CardDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    moods: {
      type: String,
      required: true,
    },
    tags: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id.toString();
        ret.list_id = ret.list_id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

const Card = mongoose.model<CardDocument, CardModel>("Card", CardSchema);
export default Card;
