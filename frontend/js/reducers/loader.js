
//import type { Action } from '../actions/types';
//import { SET_USER } from '../actions/user';

export default function appStateReducer(state = { loading: false }, action) {
  switch(action.type) {
    case "SET_LOADING":
      return { loading: action.payload };
    default:
      return { loading: false };
  }
}