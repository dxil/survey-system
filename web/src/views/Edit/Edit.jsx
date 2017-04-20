import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import classNames from 'classnames';
import { isArray, isInteger, testIndex, testOptions, testIsRequired } from '../../scripts/util';
import { Input, Dialog } from "../../components";
import * as QuestionnaireActions from "../../actions/questionnaires";
import * as DialogActions from "../../actions/dialog";
import { RADIO, CHECKBOX, TEXT } from "../../constants/QuestionTypes";
import { UNRELEASED, RELEASED, CLOSED } from "../../constants/QuestionnaireStatusTypes";
import styles from "./Edit.scss";

const mapStateToProps = state => ({
    questionnaires: state.questionnaires,
    dialog: state.dialog
});

const mapDispatchToProps = dispatch => ({
    actions: Object.assign({},
        bindActionCreators(QuestionnaireActions, dispatch),
        bindActionCreators(DialogActions, dispatch)
    )
});

@connect(mapStateToProps, mapDispatchToProps)
class Edit extends Component {
    static propTypes = {
        questionnaires: PropTypes.shape({
            list: PropTypes.arrayOf(PropTypes.shape({
                title: PropTypes.string.isRequired,
                time: PropTypes.number.isRequired,
                status: PropTypes.oneOf([UNRELEASED, RELEASED, CLOSED]).isRequired,
                questions: PropTypes.arrayOf(PropTypes.shape({
                    type: PropTypes.oneOf([RADIO, CHECKBOX, TEXT]).isRequired,
                    content: PropTypes.string.isRequired,
                    options: testOptions,
                    isRequired: testIsRequired
                }).isRequired).isRequired,
                data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.oneOfType([
                    testIndex,
                    PropTypes.arrayOf(testIndex),
                    PropTypes.string
                ]).isRequired).isRequired).isRequired
            })).isRequired,
            editing: PropTypes.shape({
                questionnaire: testIndex,
                title: PropTypes.string.isRequired,
                time: PropTypes.number.isRequired,
                order: PropTypes.oneOf([0, 1]).isRequired,
                questions: PropTypes.arrayOf(PropTypes.shape({
                    content: PropTypes.string.isRequired,
                    type: PropTypes.oneOf([RADIO, CHECKBOX, TEXT]).isRequired,
                    options: testOptions,
                    isRequired: testIsRequired
                }).isRequired).isRequired,
                type: PropTypes.bool.isRequired,
                question: testIndex,
                option: testIndex,
                text: PropTypes.shape({
                    typing: PropTypes.bool.isRequired,
                    content: PropTypes.string.isRequired
                }).isRequired,
                data: PropTypes.arrayOf(PropTypes.oneOfType([
                    testIndex,
                    PropTypes.arrayOf(testIndex),
                    PropTypes.string
                ]).isRequired).isRequired
            }).isRequired
        }).isRequired,
        dialog: PropTypes.shape({
            status: PropTypes.oneOf([0, 1, 2, 3]).isRequired,
            id: PropTypes.string.isRequired
        }).isRequired,
        calendar: PropTypes.object.isRequired,
        actions: PropTypes.shape({
            editText: PropTypes.func.isRequired,
            saveText: PropTypes.func.isRequired,
            chooseType: PropTypes.func.isRequired,
            addQuestion: PropTypes.func.isRequired,
            removeQuestion: PropTypes.func.isRequired,
            shiftQuestion: PropTypes.func.isRequired,
            copyQuestion: PropTypes.func.isRequired,
            addOption: PropTypes.func.isRequired,
            removeOption: PropTypes.func.isRequired,
            toggleRequirement: PropTypes.func.isRequired,
            saveQuestionnaire: PropTypes.func.isRequired,
            releaseQuestionnaire: PropTypes.func.isRequired,
            switchDialog: PropTypes.func.isRequired
        }).isRequired
    };
    constructor(props) {
        super(props);
        this.handleEditText = this.handleEditText.bind(this);
        this.handleSaveText = this.handleSaveText.bind(this);
        this.handleChooseType = this.handleChooseType.bind(this);
        this.handleAddQuestion = this.handleAddQuestion.bind(this);
        this.handleRemoveQuestion = this.handleRemoveQuestion.bind(this);
        this.handleShiftQuestion = this.handleShiftQuestion.bind(this);
        this.handleCopyQuestion = this.handleCopyQuestion.bind(this);
        this.handleAddOption = this.handleAddOption.bind(this);
        this.handleRemoveOption = this.handleRemoveOption.bind(this);
        this.handleToggleRequirement = this.handleToggleRequirement.bind(this);
        this.handleSaveQuestionnaire = this.handleSaveQuestionnaire.bind(this);
        this.handleReleaseQuestionnaire = this.handleReleaseQuestionnaire.bind(this);
    }
    handleEditText(question, option, content) {
        const { editText } = this.props.actions;
        console.log('edit');
        return event => editText(content || event.target.value, question, option);
    }
    handleSaveText(event) {
        const { saveText } = this.props.actions;
        console.log('save');
        saveText(event.target.value.trim());
    }
    handleChooseType() {
        const { chooseType } = this.props.actions;
        chooseType();
    }
    handleAddQuestion(event) {
        const { chooseType, addQuestion } = this.props.actions;
        chooseType();
        [RADIO, CHECKBOX, TEXT].forEach((element) => event.target === this.refs[element] && addQuestion(element))
    }
    handleAddOption(question) {
        const { addOption } = this.props.actions;
        return event => addOption(question);
    }
    handleRemoveOption(question, option) {
        const { removeOption } = this.props.actions;
        return event => removeOption(question, option);
    }
    handleToggleRequirement(question) {
        const { toggleRequirement } = this.props.actions;
        return event => toggleRequirement(question);
    }
    handleShiftQuestion(question, direction) {
        const { shiftQuestion } = this.props.actions;
        return event => shiftQuestion(question, direction);
    }
    handleCopyQuestion(question) {
        const { copyQuestion } = this.props.actions;
        return event => copyQuestion(question)
    }
    handleRemoveQuestion(question) {
        const { removeQuestion } = this.props.actions;
        return envent => removeQuestion(question);
    }
    handleSaveQuestionnaire(event) {
        console.log(this.props)
        const { dialog: { status }, actions: { saveQuestionnaire, switchDialog } } = this.props;
        const id = "save-btn";
        if (status ^ 1 && status ^ 3) {
            if (event.target === this.refs[id]) {
                saveQuestionnaire();
                switchDialog(id);
                setTimeout(() => switchDialog(id), 290);
            }
            else if (status === 2) {
                switchDialog(id);
                setTimeout(() => switchDialog(id), 290);
            }
        }
    }
    handleReleaseQuestionnaire(event) {
        const { dialog: { status }, actions: { releaseQuestionnaire, saveQuestionnaire, switchDialog } } = this.props;
        const id = "release-btn";
        if (status ^ 1 && status ^ 3) {
            if (event.target === this.refs[id]) {
                switchDialog(id);
                setTimeout(() => switchDialog(id), 290)
            }
            else if (status === 2) {
                if (event.target === this.refs["confirm-btn"]) {
                    saveQuestionnaire();
                    releaseQuestionnaire();
                    switchDialog("");
                    switchDialog("");
                }
                else {
                    switchDialog(id);
                    setTimeout(() => switchDialog(id), 290);
                }
            }
        }
    }
    isLegal() {
        const { questionnaires: { editing: { title, time, questions } } } = this.props;
        return title && new Date(time).getFullYear() !== 1970 && questions.length && questions.every(question =>
                question.content && (question.type === TEXT || question.options.length > 1 && question.options.every(option => option))
            );
    }
    renderTypes() {
        const { questionnaires: { editing: { type } } } = this.props;
        if (type) {
            return (
                <div
                    className={styles["type-wrap"]}
                    onClick={this.handleAddQuestion}
                >
                    <div ref={RADIO} className={classNames(styles.type, styles.radio)}>{RADIO}</div>
                    <div ref={CHECKBOX} className={classNames(styles.type, styles.checkbox)}>{CHECKBOX}</div>
                    <div ref={TEXT} className={classNames(styles.type, styles.text)}>{TEXT}</div>
                </div>
            );
        }
    }
    renderQuestionnaireTitle() {
        const { questionnaires: { editing } } = this.props;
        console.log('title');
        console.log(editing);
        if(editing.text.typing && editing.question === -1 && editing.option === -1) {
            return (
                <Input
                    content={editing.text.content}
                    className={styles["edit-questionnaire-title"]}
                    onEdit={this.handleEditText(-1, -1)}
                    onSave={this.handleSaveText}
                />
            );
        }
        else {
            const title = editing.title;
            return (
                <h1
                    className={styles["questionnaire-title"]}
                    onClick={this.handleEditText(-1, -1, title)}
                >
                    {title}
                </h1>
            );
        }
    }
    renderQuestionContent(question) {
        const { questionnaires: { editing } } = this.props;
        if (editing.text.typing && editing.question === question && editing.option === -1) {
            return (
                <Input
                    content={editing.text.content}
                    className={styles["edit-question-content"]}
                    onEdit={this.handleEditText(editing.question, -1)}
                    onSave={this.handleSaveText}/>
            );
        }
        else {
            const { type } = editing.questions[question];
            if (type === TEXT) {
                return (
                    <div className={styles["question-content"]}>
                        <span>{`${TEXT}题`}</span>
                    </div>
                );
            }
            else {
                const { content } = editing.questions[question];
                return (
                    <div
                        className={styles["question-content"]}
                        onClick={this.handleEditText(question, -1, content)}
                    >
                        {content}
                    </div>
                );
            }
        }
    }
    renderOption(question, option) {
        const { questionnaires: { editing } } = this.props;
        if (editing.text.typing && editing.question === question && editing.option === option) {
            return (
                <Input
                    content={editing.text.content}
                    className={styles["edit-option"]}
                    onEdit={this.handleEditText(editing.question, editing.option)}
                    onSave={this.handleSaveText}
                />
            );
        }
        else {
            const content = editing.questions[question].options[option];
            return (
                <span onClick={this.handleEditText(question, option, content)}>
                    {content}
                </span>
            );
        }
    }
    renderQuestions() {
        const { questionnaires: {editing} } = this.props;
        const last = editing.questions.length - 1;
        return (
            editing.questions.map((question, questionIndex) =>
                <div
                    key={questionIndex}
                    className={styles.question}
                >
                    <div className={styles.caption}>
                        <span>{`Q${questionIndex + 1}`}</span>
                        {this.renderQuestionContent(questionIndex)}
                    </div>
                    {question.type !==  TEXT ? (
                        <div>
                            {question.options.map((option, optionIndex) =>
                                <div
                                    key={optionIndex}
                                    className={styles["option-wrap"]}
                                >
                                    <span className={classNames({
                                        [styles["radio-option-icon"]]: question.type === RADIO,
                                        [styles["checkbox-option-icon"]]: question.type === CHECKBOX
                                    })} />
                                    {this.renderOption(questionIndex, optionIndex)}
                                    <span
                                        className={styles["remove-option-btn"]}
                                        onClick={this.handleRemoveOption(questionIndex, optionIndex)}
                                    />
                                </div>
                            )}
                            <div
                                className={styles["add-option-btn"]}
                                onClick={this.handleAddOption(questionIndex)}
                            />
                        </div>
                    ) : (
                        <div>
                            <textarea
                                value={question.content}
                                className={styles.text}
                                onChange={this.handleEditText(questionIndex, 0)}
                            />
                            <div
                                className={classNames({
                                    [styles.required]: question.isRequired,
                                    [styles["not-required"]]: !question.isRequired
                                })}
                                onClick={this.handleToggleRequirement(questionIndex)}
                            >
                                <span>此题是否必填</span>
                            </div>
                        </div>
                    )}
                    <div className={styles["operation-wrap"]}>
                        {questionIndex > 0 && (
                            <div
                                className={styles.operation}
                                onClick={this.handleShiftQuestion(questionIndex, -1)}
                            >
                                <span>上移</span>
                            </div>
                        )}
                        {questionIndex < last && (
                            <div
                                className={styles.operation}
                                onClick={this.handleShiftQuestion(questionIndex, 1)}
                            >
                                <span>下移</span>
                            </div>
                        )}
                        <div
                            className={styles.operation}
                            onClick={this.handleCopyQuestion(questionIndex)}
                        >
                            <span>复用</span>
                        </div>
                        <div
                            className={styles.operation}
                            onClick={this.handleRemoveQuestion(questionIndex)}
                        >
                            <span>删除</span>
                        </div>
                    </div>
                </div>
            )
        );
    }
    render() {
        const { questionnaires: { editing }, dialog, actions: { switchDialog } } = this.props;
        const time = new Date(editing.time);
        const [year, month, date] = [time.getFullYear(), time.getMonth() + 1, time.getDate()];
        return(
            <div>
                {this.renderQuestionnaireTitle()}
                <hr className={styles.line}/>
                <div className={styles["question-wrap"]}>
                    {this.renderQuestions()}
                </div>
                <div className={styles["add-question"]}>
                    <ReactCSSTransitionGroup
                        transitionName={styles}
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={300}
                    >
                        {this.renderTypes()}
                    </ReactCSSTransitionGroup>
                    <div
                        className={styles["add-question-btn"]}
                        onClick={this.handleChooseType}
                    >
                        <span>添加问题</span>
                    </div>
                </div>
                <hr className={styles.line}/>
                <div className={styles.footer}>
                    <div className={styles["date-wrap"]}>
                        <span>问卷截止日期</span>
                        {/*{this.render}*/}
                    </div>
                    <input
                        ref="save-btn"
                        type="button"
                        value="保存问卷"
                        className={styles.btn}
                        onClick={this.handleSaveQuestionnaire}
                    />
                    <input
                        ref="release-btn"
                        type="button"
                        value="发布问卷"
                        className={styles.btn}
                        onClick={this.handleReleaseQuestionnaire}
                    />
                    <Dialog
                        dialog={dialog}
                        self={this}
                        id={"save-btn"}
                        onLeave={this.handleSaveQuestionnaire}
                        title={"提示"}
                    >
                        <div className={styles.dialog}>
                            <div>
                                <p>{`问卷已保存。`}</p>
                            </div>
                            <div className={styles["btn-wrap"]}>
                                <input
                                    type="button"
                                    value="确定"
                                    className={styles.btn}
                                    onClick={this.handleSaveQuestionnaire}
                                />
                            </div>
                        </div>
                    </Dialog>
                    <Dialog
                        dialog={dialog}
                        self={this}
                        id={"release-btn"}
                        onLeave={this.handleReleaseQuestionnaire}
                        title={"提示"}
                    >
                        {this.isLegal() ? (
                            <div className={styles.dialog}>
                                <div>
                                    <p>{`是否发布问卷？`}</p>
                                    <p>{`（本问卷截止日期为${year}-${month}-${date}）`}</p>
                                </div>
                                <div className={styles["btn-wrap"]}>
                                    <Link to="/" className={styles.link}>
                                        <input
                                            ref="confirm-btn"
                                            type="button"
                                            value="确定"
                                            className={styles.btn}
                                            onClick={this.handleReleaseQuestionnaire}
                                        />
                                    </Link>
                                    <input
                                        type="button"
                                        value="取消"
                                        className={styles.btn}
                                        onClick={this.handleReleaseQuestionnaire}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className={styles.dialog}>
                                <div>
                                    <p>{year === 1970 ? `请设置问卷截止日期。` : `请合理设置问卷内容。`}</p>
                                </div>
                                <div className={styles["btn-wrap"]}>
                                    <input
                                        type="button"
                                        value="确定"
                                        className={styles.btn}
                                        onClick={this.handleReleaseQuestionnaire}
                                    />
                                </div>
                            </div>
                        )}
                    </Dialog>
                </div>
            </div>
        );
    }

}

export default Edit;

/*
* 问卷建立过程
* 1.点击添加问题 调用 handleChooseType Function 来调用chooseType Action改变type => true
* 2.renderTypes 订阅了state type 的变化，接受到true后自动展现选择文本框
* 3.点击类型后调用handleAddQuestion Function  内部调用foreach来查询点击的方法并调用addQuestion Action 来传入默认的参数
* 4.renderQuestions Function 中监控了editting.questions 的长度 添加问卷
* 5.内部调用renderQuestionContent Function 取得问题的题目 点击 其中的content 触发handleEditText Function
*   5.1 传入的question -1 用来标识这是改变第几个question的标题
*   5.2 handleEditText 调用editText Action 来更改当前editing的typing为true
*   5.3 当前renderQuestionContent Function中同样监听了text的typing的属性 于是div => input 并监听edit save方法 同时最后改typing为FALSE
* 6.renderOption 方法流程类似
* 7.移除Option单纯splice
* 8.当问题为文本题时可以选择是否必答该问题，用到toogleOption Action 操作!!(editing.questions[question].isRequired ^ 1) ^ 异或操作 取反 !!确保返回预期的Boolean值
* 9.上下移动问题用到shiftQuestion Action editing.questions.splice(question + direction, 0, editing.questions.splice(question, 1)[0]);
* 10.
* */