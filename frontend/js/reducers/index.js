import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import drawer from "./drawer";
import user from "./user";
import list from "./list";
import appStateReducer from "./loader";
import goback_reducer from "./goback_reducer";
import goback_reducerEdit from "./goback_reducerEdit";
export default combineReducers({
  form: formReducer,
  drawer,
  user,
  list,
  goback_reducer,
  goback_reducerEdit,
  app: appStateReducer
});
