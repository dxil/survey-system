import { createAction } from "redux-actions";
import * as Types from "../constants/QuestionnaireActionTypes";

export const addQuestionnaire = createAction(Types.ADD_QUESTIONNAIRE);
export const editQuestionnaire = createAction(Types.EDIT_QUESTIONNAIRE, questionnaire => questionnaire);
export const editText = createAction(Types.EDIT_TEXT, (content, question, option) => ({ content, question, option }));
export const saveText = createAction(Types.SAVE_TEXT, content => content);