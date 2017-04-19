import { combineReducers } from "redux";
import { routerReducer as routing } from "react-router-redux";
import questionnaires from "./questionnaires";
import dialog from "./dialog"

const rootReducer = combineReducers({
    routing,
    questionnaires,
    dialog
});

export default rootReducer;