import React from "react";
import StepWizard from "react-step-wizard";
import Question from "./Question";
import PropTypes from "prop-types";
import * as registrationSurveyService from "../../services/registrationSurveyService.js";
import { addSurveyInstance } from "../../services/surveyInstance";
import { addSurveyAnswer } from "../../services/surveyAnswers";
import swal from "sweetalert";

import logger from "../../logger";
const _logger = logger.extend("RegistrationSurvey");

class RegistrationSurvey extends React.Component {
  state = {
    survey: null,
    answers: [],
    surveyInstanceId: 0,
    isDisabled: true,
    isValidZipCode: false,
    skipToSeven: false,
    skipToSix: false
  };

  componentDidMount() {
    registrationSurveyService
      .getQuestionAnswerOptions()
      .then(this.onGetQuestionAnswerOptionsSuccess)
      .catch(this.onError);
  }

  resetAnswers = () => {
    const survey = { ...this.state.survey };
    const resetArr = this.state.answers.filter(answer => {
      return answer.questionId === 1;
    });
    let newSurvey = survey.surveyQDetails.map(detail => {
      detail.isAnswered = false;
      return detail;
    });
    const survey2 = {
      ...this.state.survey,
      surveyQDetails: newSurvey
    };
    this.setState({ survey: survey2, answers: resetArr });
  };

  submitAnswer = (answerId, questionId, checked, answered) => {
    const answers = [...this.state.answers];
    const survey = { ...this.state.survey };

    const answeredIndex = survey.surveyQDetails.findIndex(
      question => question.questionId === questionId
    );
    survey.surveyQDetails[answeredIndex].isAnswered = answered;
    const answerOption = {
      questionId: questionId,
      answerId: parseInt(answerId)
    };
    if (questionId === 12) {
      if (checked === false) {
        const index = answers.findIndex(answer => answerId === answer.answerId);
        answers.splice(index, 1);
        const found = answers.findIndex(
          answer => questionId === answer.questionId
        );
        // if no check boxes are checked
        if (found === -1) {
          const answeredIndex = survey.surveyQDetails.findIndex(
            question => question.questionId === questionId
          );
          survey.surveyQDetails[answeredIndex].isAnswered = false;
          this.setState({ survey, answers });
          return;
        }

        this.setState({ survey, answers });
      } else {
        answers.push(answerOption);
        this.setState({ survey, answers });
      }
    } else {
      let completedAnswer = answers.findIndex(
        answer => questionId === answer.questionId
      );
      if (completedAnswer > -1) {
        answers.splice(completedAnswer, 1);
      }
      answers.push(answerOption);
      this.setState({ survey, answers });
    }
  };

  toggleDisable = toggle => {
    this.setState(() => {
      return {
        isDisabled: toggle
      };
    });
  };

  toggleZipCode = toggle => {
    this.setState(() => {
      return {
        isValidZipCode: toggle
      };
    });
  };

  jumpToSevevn = toggle => {
    this.setState(() => {
      return {
        skipToSeven: toggle
      };
    });
  };

  jumpToSix = toggle => {
    this.setState(() => {
      return {
        skipToSix: toggle
      };
    });
  };

  submitZipCode = (value, questionId, answered) => {
    const answers = [...this.state.answers];
    const survey = { ...this.state.survey };
    const answeredIndex = survey.surveyQDetails.findIndex(
      question => question.questionId === questionId
    );

    const index = answers.findIndex(
      answer => answer.questionId === parseInt(questionId)
    );

    if (index !== -1) {
      answers.splice(index, 1);
    }

    survey.surveyQDetails[answeredIndex].isAnswered = answered;

    const answerOption = {
      questionId: questionId,
      values: value
    };
    answers.push(answerOption);
    this.setState({ survey, answers });
  };

  mapQuestion = question => {
    return (
      <Question
        key={question.questionId}
        question={question}
        submit={this.submitAnswer}
        submitValue={this.submitZipCode}
        answers={this.state.answers}
        createSurveyInstance={this.createSurveyInstance}
        isValidZipCode={this.state.isValidZipCode}
        skipToSeven={this.state.skipToSeven}
        skipToSix={this.state.skipToSix}
        toggleZipCode={this.toggleZipCode}
        jumpToSeven={this.jumpToSevevn}
        jumpToSix={this.jumpToSix}
        resetAnswers={this.resetAnswers}
      />
    );
  };

  createSurveyInstance = () => {
    const surveyInstance = { surveyId: this.state.survey.id };

    addSurveyInstance(surveyInstance)
      .then(this.onSurveyInstanceCreateSuccess)
      .catch(this.onError);
  };

  onSurveyInstanceCreateSuccess = resp => {
    const surveyInstanceId = resp.item;
    this.setState({ surveyInstanceId });
    this.submitAnswerArray(surveyInstanceId);
  };

  submitAnswerArray = instanceId => {
    const finalAnswers = this.state.answers.map(answer => {
      if (answer.answerId) {
        return {
          instanceId: instanceId,
          questionId: answer.questionId,
          answerOptionId: answer.answerId
        };
      } else {
        return {
          instanceId: instanceId,
          questionId: answer.questionId,
          answer: answer.values
        };
      }
    });

    addSurveyAnswer(finalAnswers)
      .then(this.onSuccessSurveySubmit)
      .catch(this.onError);
  };

  onSuccessSurveySubmit = () => {
    swal({
      title: "Congrats, Survey Submitted!",
      text: "Let's go see resources that might help...",
      icon: "success",
      timer: 2500,
      button: false
    }).then(() => {
      this.props.history.push(`/recommendations`, {
        id: this.state.surveyInstanceId
      });
    });
  };

  onGetQuestionAnswerOptionsSuccess = resp => {
    const survey = resp.item;

    survey.surveyQDetails = survey.surveyQDetails.map(question => {
      question.isAnswered = false;
      return question;
    });

    this.setState({
      survey: survey
    });
  };

  onError = resp => {
    _logger("Error", resp);
  };

  render() {
    return (
      <div>
        {this.state.survey ? (
          <StepWizard>
            {this.state.survey.surveyQDetails.map(this.mapQuestion)}
          </StepWizard>
        ) : (
          ""
        )}
      </div>
    );
  }
}

RegistrationSurvey.propTypes = {
  history: PropTypes.object
};

export default RegistrationSurvey;
