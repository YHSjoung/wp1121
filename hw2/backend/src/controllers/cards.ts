// Get cards
// Path: backend/src/controllers/cards.ts
import CardModel from "../models/card";
import ListModel from "../models/list";
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
      list_id: card.list_id.toString(),
      link: card.link,
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
      list_id: card.list_id.toString(),
      link: card.link,
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
    const { title, description, list_id, link } = req.body;

    // Check if the list exists
    const list = await ListModel.findById(list_id);
    if (!list) {
      return res.status(404).json({ error: "list_id is not valid" });
    }

    const card = await CardModel.create({
      title,
      description,
      list_id,
      link,
    });

    // Add the card to the list
    list.cards.push(card._id);
    await list.save();

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
  // Create mongoose transaction
  const session = await CardModel.startSession();
  session.startTransaction();
  // In `updateCard` function, 2 database operations are performed:
  // 1. Update the card
  // 2. Update the list
  // If one of them fails, we need to rollback the other one.
  // To do that, we need to use mongoose transaction.

  try {
    const { id } = req.params;
    const { title, description, list_id, link } = req.body;

    // Check if the card exists
    const oldCard = await CardModel.findById(id);
    if (!oldCard) {
      return res.status(404).json({ error: "id is not valid" });
    }

    // If the user wants to update the list_id, we need to check if the list exists
    if (list_id) {
      // Check if the list exists
      const listExists = await ListModel.findById(list_id);
      if (!listExists) {
        return res.status(404).json({ error: "list_id is not valid" });
      }
    }

    const newCard = await CardModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        list_id,
        link,
      },
      { new: true },
    );

    if (!newCard) {
      return res.status(404).json({ error: "id is not valid" });
    }

    // If the user wants to update the list_id, we need to update the list as well
    if (list_id) {
      // Remove the card from the old list
      const oldList = await ListModel.findById(oldCard.list_id);
      if (!oldList) {
        return res.status(404).json({ error: "list_id is not valid" });
      }
      oldList.cards = oldList.cards.filter(
        (cardId) => cardId.toString() !== id,
      );
      await oldList.save();

      // Add the card to the new list
      const newList = await ListModel.findById(list_id);
      if (!newList) {
        return res.status(404).json({ error: "list_id is not valid" });
      }
      newList.cards.push(newCard.id);
      await newList.save();
    }

    // Commit the transaction
    // This means that all database operations are successful
    await session.commitTransaction();

    return res.status(200).send("OK");
  } catch (error) {
    // Rollback the transaction
    // This means that one of the database operations is failed
    await session.abortTransaction();
    genericErrorHandler(error, res);
  }
};

// Delete a card
export const deleteCard = async (
  req: Request<{ id: string }[]>,
  res: Response,
) => {
  // Create mongoose transaction
  const session = await CardModel.startSession();
  session.startTransaction();

  try {
    const { Ids: isCheckedList } = req.body;

    // Delete the card from the database
    const cards2detele = await CardModel.find({ _id: { $in: isCheckedList } });
    const deletedCards = await CardModel.deleteMany({
      _id: { $in: isCheckedList },
    });
    if (deletedCards.deletedCount === 0) {
      return res.status(404).json({ error: "Ids are not valid" });
    }

    // Delete the card from the list
    for (const deletedCard of cards2detele) {
      const list = await ListModel.findById(deletedCard.list_id);
      if (!list) {
        return res.status(404).json({ error: "list_id is not valid" });
      }
      list.cards = list.cards.filter(
        (cardId) => !isCheckedList.includes(cardId.toString()),
      );
      await list.save();
    }

    // Commit the transaction
    session.commitTransaction();

    return res.status(200).send("OK");
  } catch (error) {
    session.abortTransaction();
    genericErrorHandler(error, res);
  } finally {
    session.endSession();
  }
};
