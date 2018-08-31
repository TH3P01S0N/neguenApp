import {IS_GO_BACK} from '../actions/goback_action'
import { IS_GO_BACK_OFF } from '../actions/goback_action_off';

// This is the default state of the app i.e. when the app starts for the first time
const initialState = {
  flag: false
}

// This is a reducer which listens to actions and modifies the state
const goback_reducer = (state = initialState, action) => {
  // A switch is used since if more actions are added in the future, it will be easy
  // to be able to handle this in the reducer since we just add another 'case'.
  switch (action.type) {
    case IS_GO_BACK:
      return {
        ...state,
        flag: true
      }
    case IS_GO_BACK_OFF:
      return {
        ...state,
        flag: false
      }
    default:
      return state
    }
}
export default goback_reducer;