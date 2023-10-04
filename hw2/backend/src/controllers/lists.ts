import CardModel from "../models/card";
import ListModel from "../models/list";
import { genericErrorHandler } from "../utils/errors";
import type {
  CardData,
  CreateListPayload,
  CreateListResponse,
  GetListsResponse,
  ListData,
  UpdateListPayload,
} from "@lib/shared_types";
import type { Request, Response } from "express";
import multer from "multer";
import path from "path";

// Get all lists
export const getLists = async (_: Request, res: Response<GetListsResponse>) => {
  try {
    const lists = await ListModel.find({});

    // Return only the id and name of the list
    const listsToReturn = lists.map((list) => {
      return {
        id: list.id,
        name: list.name,
        picture: list.picture,
        description: list.description,
      };
    });

    return res.status(200).json(listsToReturn);
  } catch (error) {
    genericErrorHandler(error, res);
  }
};

// Get a list
export const getList = async (
  req: Request<{ id: string }>,
  res: Response<ListData | { error: string }>,
) => {
  try {
    const { id } = req.params;
    const lists = await ListModel.findById(id).populate("cards");
    if (!lists) {
      return res.status(404).json({ error: "id is not valid" });
    }

    return res.status(200).json({
      id: lists.id,
      name: lists.name,
      cards: lists.cards as unknown as CardData[],
      picture: lists.picture,
      description: lists.description,
    });
  } catch (error) {
    genericErrorHandler(error, res);
  }
};

// Create a list
export const createList = async (
  req: Request<never, never, CreateListPayload>,
  res: Response<CreateListResponse>,
) => {
  try {
    const { id } = await ListModel.create(req.body);
    return res.status(201).json({ id });
  } catch (error) {
    genericErrorHandler(error, res);
  }
};

// Update a list
export const updateList = async (
  req: Request<{ id: string }, never, UpdateListPayload>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { name, description, picture } = req.body;

    // Update the list
    const newList = await ListModel.findByIdAndUpdate(
      id,
      {
        name: name,
        description: description,
        picture: picture,
      },
      { new: true },
    );

    // If the list is not found, return 404
    if (!newList) {
      return res.status(404).json({ error: "id is not valid" });
    }

    return res.status(200).send("OK");
  } catch (error) {
    genericErrorHandler(error, res);
  }
};

// Delete a list
export const deleteList = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  // Create a transaction
  const session = await ListModel.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    // Delete the list
    const deletedList = await ListModel.findByIdAndDelete(id);

    // If the list is not found, return 404
    if (!deletedList) {
      return res.status(404).json({ error: "id is not valid" });
    }

    // Delete all the cards in the list
    for (const cardId of deletedList.cards) {
      await CardModel.findByIdAndDelete(cardId);
    }

    // Commit the transaction
    await session.commitTransaction();

    return res.status(200).send("OK");
  } catch (error) {
    // Rollback the transaction
    await session.abortTransaction();
    genericErrorHandler(error, res);
  } finally {
    session.endSession();
  }
};

// Store the picture in backend

// this is a middleware
const storePictureMulter = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../storePic"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const storePictureMiddleware = multer({ storage: storePictureMulter }).single(
  "picture",
);

// this is the function api work
export const storePicture = async (req: Request, res: Response) => {
  try {
    storePictureMiddleware(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: "Upload failed." });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file upload." });
      }

      return res
        .status(200)
        .json({
          imageUrl: `http://localhost:8000/storePic/${req.file.filename}`,
        });
    });
  } catch (error) {
    genericErrorHandler(error, res);
  }
};
