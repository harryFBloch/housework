import { ActionType } from "../actionTypes";
import { Homes } from "./types";
import { RootAction } from "..";

const initialState: Homes = {};

export default function auth(state=initialState, action: RootAction): typeof initialState  {
  switch (action.type) {

    case(ActionType.GET_HOMES):
      return {...action.homes}

    default:
      return state;
  }
}