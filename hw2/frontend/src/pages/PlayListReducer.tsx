import type { CardProps } from "../components/Card";
import type { CardListProps } from "../components/CardList";

type ActionType =
  | { type: "SET_PLAYLIST"; payload: CardListProps }
  | { type: "UPDATE_LISTNAME"; payload: string }
  | { type: "UPDATE_LISTDESCRIPTION"; payload: string }
  | { type: "ADD_CARD_2_PLAYLIST"; payload: CardProps[] }
  | { type: "UPDATE_PICTURE"; payload: string };

export const PlayListReducer = (state: CardListProps, action: ActionType) => {
  switch (action.type) {
    case "SET_PLAYLIST":
      return action.payload;
    case "UPDATE_LISTNAME":
      return {
        ...state,
        name: action.payload,
      };
    case "UPDATE_LISTDESCRIPTION":
      return {
        ...state,
        description: action.payload,
      };
    case "UPDATE_PICTURE":
      return {
        ...state,
        picture: action.payload,
      };
    default:
      return state;
  }
};
