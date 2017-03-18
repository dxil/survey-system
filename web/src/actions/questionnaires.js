import { createAction } from "redux-actions";
import * as Types from "../constants/QuestionnaireActionTypes";

export const addQuestionnaire = createAction(Types.ADD_QUESTIONNAIRE);
export const editQuestionnaire = createAction(Types.EDIT_QUESTIONNAIRE, questionnaire => questionnaire);