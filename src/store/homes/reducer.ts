import { ActionType } from "../actionTypes";
import { Homes } from "./types";
import { RootAction } from "..";

const initialState = {
  homes: {} as Homes,
  currentHome: '0',
};

export default function auth(state=initialState, action: RootAction): typeof initialState  {
  switch (action.type) {

    case(ActionType.GET_HOMES):
      return { ...state,homes: {...action.homes}}

    case(ActionType.SAVE_HOME):
      return {...state,homes: {...state.homes, [action.home.id]: action.home}, currentHome: action.home.id}

    case(ActionType.COMPLETE_TASK):
      const newHome = {...state.homes[action.homeID]}
      newHome.rooms[action.roomID].tasks[action.taskID].lastCleaned = String(new Date())
      return {...state, homes: {...state.homes, [action.homeID]: newHome}}

    default:
      return state;
  }
}