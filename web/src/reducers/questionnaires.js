import { handleActions } from "redux-actions";
import { cloneObject } from "../scripts/util";
import * as Types from "../constants/QuestionnaireActionTypes";
import { UNRELEASED, RELEASED, CLOSED } from "../constants/QuestionnaireStatusTypes";
import { RADIO, CHECKBOX, TEXT } from "../constants/QuestionTypes";

const list = localStorage.list ? JSON.parse(localStorage.list) : [];
const initialEditing = {
    questionnaire: -1,
    title: "这里是标题",
    time: 0,
    order: 0,
    questions: [],
    type: false,
    question: -1,
    option: -1,
    text: { typing: false, content: "" },
    data: []
};
const initialState =  {
    list,
    editing: cloneObject(initialEditing)
};

const questionnaires = handleActions({
    [Types.ADD_QUESTIONNAIRE](state, action) {
        const { list } = state;
        return Object.assign({}, state, { editing: { ...cloneObject(initialEditing), questionnaire: list.length } });
    },
    [Types.EDIT_QUESTIONNAIRE](state, action) {
        const { list } = state;
        const questionnaire = action.payload;
        const { title, time } = list[questionnaire];
        const questions = cloneObject(list[questionnaire].questions);
        const editing = { ...cloneObject(initialEditing), questionnaire, title, time, questions };
        return Object.assign({}, state, { editing });
    },
    [Types.EDIT_TEXT](state, action) {
        const { editing } = state;
        const { content, question, option } = action.payload;
        console.log(state);
        console.log(action);
        if (question !== -1 && option !== -1 && editing.questions[question].type === TEXT) {
            editing.questions[question].content = content;
            return Object.assign({}, state, { editing });
        }
        else {
            console.log('typing');
            return Object.assign({}, state, { editing: { ...editing, question, option, text: { typing: true, content } } });
        }
    },
    [Types.SAVE_TEXT](state, action) {
        const { editing } = state;
        const { questionnaire, question, option } = editing;
        const content = action.payload;
        switch (true) {
            case question === -1: editing.title = content; break;
            case option === -1: editing.questions[question].content = content; break
            default: editing.questions[question].options[option] = content;
        }
        return Object.assign({}, state, { editing: { ...editing, question: -1, option: -1, text: { typing: false, content: ""} } });
    }
}, initialState);

export default questionnaires;