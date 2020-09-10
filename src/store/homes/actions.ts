import { ThunkResult, ThunkDispatchType } from "../types";
import firebase from '../../config/FirebaseConfig';
import 'firebase/database';
import { ActionType } from "../actionTypes";
import { RootState } from "..";
import { Home } from "./types";

export const getHomes = (): ThunkResult<Promise<void>> =>
  async ( dispatch: ThunkDispatchType, getState: () => RootState ): Promise<void> => {
    return firebase.database().ref(`/users/${getState().auth.uid}/`).once('value')
    .then((snapshot) => {
      if (snapshot.val()) {
        dispatch({type: ActionType.GET_HOMES, homes: snapshot.val().homes})
        return Promise.resolve()
      } else {
        return Promise.reject()
      }
    })
}


export const saveHome = (house: Home): ThunkResult<Promise<void>> =>
  async ( dispatch: ThunkDispatchType, getState: () => RootState ): Promise<void> => {
    const uid = getState().auth.uid;
    const houseID = house.id === '' ? String(Object.keys(getState().homes.homes).length) : house.id
    house.id = houseID
    house.owner = uid
    firebase.database().ref(`/users/${uid}/homes/${houseID}`).set(house)
    .then(referance => {
      dispatch({ type: ActionType.SAVE_HOME, home: house})
      return Promise.resolve()
    })
}
