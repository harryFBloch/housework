import { ActionType } from "../actionTypes";
import { Homes } from "./types";
import { RootAction } from "..";

const initialState = {
  homes: {},
  currentHome: '0',
};

export default function auth(state=initialState, action: RootAction): typeof initialState  {
  switch (action.type) {

    case(ActionType.GET_HOMES):
      return { ...state,homes: {...action.homes}}

    case(ActionType.SAVE_HOME):
      return {...state,homes: {...state.homes, [action.home.id]: action.home}, currentHome: action.home.id}

    default:
      return state;
  }
}