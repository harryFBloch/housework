import { ThunkResult, ThunkDispatchType } from "../types";
import firebase from '../../config/FirebaseConfig';
import 'firebase/database';
import { ActionType } from "../actionTypes";
import { RootState } from "..";
import { Homes } from "./types";

export const getHomes = (): ThunkResult<Promise<void>> =>
  async ( dispatch: ThunkDispatchType, getState: () => RootState ): Promise<void> => {
    return firebase.database().ref(`/users/${getState().auth.uid}/`).once('value')
    .then((snapshot) => {
      if (snapshot.val()) {
        const homeIDS = snapshot.val()
        const homes = {} as Homes
        homeIDS.forEach((id: string, i: number) => 
        firebase.database().ref(`/homes/${id}`).once('value')
        .then((snapshot) => {
          const home = snapshot.val()
          homes[home.id] = home
          if (i === homeIDS.length) {
            dispatch({type: ActionType.GET_HOMES, homes: homes})
            return Promise.resolve()
          }
        })
        )  
      } else {
        return Promise.reject()
      }
    })
}
