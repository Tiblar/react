// @flow

import { combineReducers } from "redux";
import notifications from "./reducers/notifications/reducer";
import auth from "./reducers/auth/reducer";
import portal from "./reducers/portal/reducer";
import social from "./reducers/social/reducer";
import connection from "./reducers/connection/reducer";
import error from "./reducers/error/reducer";
import theme from "./reducers/theme/reducer";

const rootReducer = combineReducers({
  notifications,
  auth,
  portal,
  social,
  connection,
  error,
  theme,
});

export default rootReducer;
