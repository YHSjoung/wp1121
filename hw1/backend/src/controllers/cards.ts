// Get cards
// Path: backend/src/controllers/cards.ts
import CardModel from "../models/card";
import { genericErrorHandler } from "../utils/errors";
import type {
  CreateCardPayload,
  CreateCardResponse,
  GetCardResponse,
  GetCardsResponse,
  UpdateCardPayload,
  UpdateCardResponse,
} from "@lib/shared_types";
import type { Request, Response } from "express";

// Get all cards
export const getCards = async (_: Request, res: Response<GetCardsResponse>) => {
  try {
    const dbCards = await CardModel.find({});
    const cards = dbCards.map((card) => ({
      id: card.id as string,
      title: card.title,
      description: card.description,
      moods: card.moods,
      tags: card.tags,
      // list_id: card.list_id.toString(),
    }));

    return res.status(200).json(cards);
  } catch (error) {
    // Check the type of error
    genericErrorHandler(error, res);
  }
};

// Get a card
export const getCard = async (
  req: Request<{ id: string }>,
  res: Response<GetCardResponse | { error: string }>,
) => {
  try {
    const { id } = req.params;

    const card = await CardModel.findById(id);
    if (!card) {
      return res.status(404).json({ error: "id is not valid" });
    }

    return res.status(200).json({
      id: card.id as string,
      title: card.title,
      description: card.description,
      moods: card.moods,
      tags: card.tags,
      // list_id: card.list_id.toString(),
    });
  } catch (error) {
    genericErrorHandler(error, res);
  }
};

// Create a card
export const createCard = async (
  req: Request<never, never, CreateCardPayload>,
  res: Response<CreateCardResponse | { error: string }>,
) => {
  try {
    // const { title, description, list_id } = req.body;
    const { title, description, moods, tags } = req.body;

    // Check if the list exists
    // const list = await ListModel.findById(list_id);
    // if (!list) {
    //   return res.status(404).json({ error: "list_id is not valid" });
    // }

    // const card = await CardModel.create({
    //   title,
    //   description,
    //   list_id,
    // });

    const card = await CardModel.create({
      title,
      description,
      moods,
      tags,
    });

    // Add the card to the list
    // list.cards.push(card._id);
    // await list.save();

    return res.status(201).json({
      id: card.id as string,
    });
  } catch (error) {
    // Check the type of error
    genericErrorHandler(error, res);
  }
};

// Update a card
export const updateCard = async (
  req: Request<{ id: string }, never, UpdateCardPayload>,
  res: Response<UpdateCardResponse | { error: string }>,
) => {
  try {
    const { id } = req.params;
    // const { title, description, list_id } = req.body;
    const { title, description, moods, tags } = req.body;

    // Check if the card exists
    const oldCard = await CardModel.findById(id);
    if (!oldCard) {
      return res.status(404).json({ error: "id is not valid" });
    }

    // If the user wants to update the list_id, we need to check if the list exists
    // if (list_id) {
    //   // Check if the list exists
    //   const listExists = await ListModel.findById(list_id);
    //   if (!listExists) {
    //     return res.status(404).json({ error: "list_id is not valid" });
    //   }
    // }

    const newCard = await CardModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        moods,
        tags,
        // list_id,
      },
      { new: true },
    );

    if (!newCard) {
      return res.status(404).json({ error: "id is not valid" });
    }

    // If the user wants to update the list_id, we need to update the list as well
    // if (list_id) {
    //   // Remove the card from the old list
    //   const oldList = await ListModel.findById(oldCard.list_id);
    //   if (!oldList) {
    //     return res.status(404).json({ error: "list_id is not valid" });
    //   }
    //   oldList.cards = oldList.cards.filter(
    //     (cardId) => cardId.toString() !== id,
    //   );
    //   await oldList.save();

    //   // Add the card to the new list
    //   const newList = await ListModel.findById(list_id);
    //   if (!newList) {
    //     return res.status(404).json({ error: "list_id is not valid" });
    //   }
    //   newList.cards.push(newCard.id);
    //   await newList.save();
    // }

    return res.status(200).send("OK");
  } catch (error) {
    // Check the type of error
    genericErrorHandler(error, res);
  }
};

// Delete a card
export const deleteCard = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;

    // Delete the card from the database
    const deletedCard = await CardModel.findByIdAndDelete(id);
    if (!deletedCard) {
      return res.status(404).json({ error: "id is not valid" });
    }

    // Delete the card from the list
    // const list = await ListModel.findById(deletedCard.list_id);
    // if (!list) {
    //   return res.status(404).json({ error: "list_id is not valid" });
    // }
    // list.cards = list.cards.filter((cardId) => cardId.toString() !== id);
    // await list.save();

    return res.status(200).send("OK");
  } catch (error) {
    genericErrorHandler(error, res);
  }
};
