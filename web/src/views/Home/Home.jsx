import React, { Component, PropTypes } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router";
import classNames from "classnames";
import * as QuestionnaireActions from "../../actions/questionnaires";
import * as DialogActions from "../../actions/dialog";
import { UNRELEASED, RELEASED, CLOSED } from "../../constants/QuestionnaireStatusTypes";
import { RADIO, CHECKBOX, TEXT } from "../../constants/QuestionTypes";
import styles from './Home.scss'

const testOptions = (props, propName, componentName) => {
    if (props.type !== TEXT
        && !(props.options && isArray(props.options) && props.options.every((option) => typeof option === "string"))) {
        return new Error(`Invalid prop '${propName}' supplied to ${componentName}. Validation failed.`);
    }
};

const testIsRequired = (props, propName, componentName) => {
    if (props.type === TEXT && typeof props.isRequired !== "boolean") {
        return new Error(`Invalid prop '${propName}' supplied to ${componentName}. Validation failed.`);
    }
};

const testIndex = (props, propName, componentName) => {
    if (!(isInteger(props[propName]) && props[propName] >= -1)) {
        return new Error(`Invalid prop '${propName}' supplied to ${componentName}. Validation failed.`);
    }
};


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
class Home extends Component {
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
        actions: PropTypes.shape({
            addQuestionnaire: PropTypes.func.isRequired,
            editQuestionnaire: PropTypes.func.isRequired,
            removeQuestionnaire: PropTypes.func.isRequired,
            sortQuestionnaire: PropTypes.func.isRequired,
            fillQuestionnaire: PropTypes.func.isRequired,
            switchDialog: PropTypes.func.isRequired
        }).isRequired
    };
    constructor(props) {
        super(props);
        this.handleAddQuestionnaire = this.handleAddQuestionnaire.bind(this);
        this.handleEditQuestionnaire = this.handleEditQuestionnaire.bind(this);
    };
    componentWillMount() {
        console.log('-----componentWillMount-----')
        const { questionnaires: { list }} = this.props;
        console.log(list);
        const now = new Date().getTime() - 86400000;
        list.forEach((questionnaire, questionnaireIndex) =>
            questionnaire.status === RELEASED && questionnaire.time < now
        );
    };
    componentDidMount() {
    };
    handleAddQuestionnaire() {
        console.log('-----Handle-----')
        const { addQuestionnaire } = this.props.actions;
        addQuestionnaire();
    };
    handleEditQuestionnaire() {
        console.log('-----Edit-----')  ;
        const { editQuestionnaire } = this.props.actions;
        return event => editQuestionnaire(questionnaire);
    };
    render() {
        const { questionnaires: { list }, dialog } = this.props;
        return list.length ? (
            <div>

            </div>
        ) : (
            <div className={styles.wrap}>
                <Link to="/edit" className={styles.link}>
                    <div
                        className={styles["add-btn"]}
                        onClick={this.handleAddQuestionnaire}
                    >
                        <span>新建问卷</span>
                    </div>
                </Link>
            </div>
        );
    }
}

export default Home