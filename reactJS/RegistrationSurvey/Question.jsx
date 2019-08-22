import React from "react";
import PropTypes from "prop-types";
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";
import Slider from "rc-slider";
import "./registrationSurvey.css";

// import logger from "../../logger";

// const _logger = logger.extend("Question");

const Question = props => {
  const targetQuestion = props.question;
  const previous = () => {
    if (
      props.currentStep === 2 ||
      props.currentStep === 6 ||
      props.currentStep === 7
    ) {
      props.resetAnswers();
    }

    if (
      ((props.answers[0].answerId === 1 || props.answers[0].answerId === 2) &&
        props.answers.length < 2) ||
      (props.answers[1] === undefined ||
        (props.answers[1].questionId !== 2 &&
          (props.currentStep === 7 || props.currentStep === 6)))
    ) {
      props.goToStep(1);
    } else {
      props.previousStep();
    }
  };

  const next = () => {
    if (props.answers[0].answerId === 1 && props.answers.length === 1) {
      props.goToStep(7);
    } else if (props.answers[0].answerId === 2 && props.answers.length === 1) {
      props.goToStep(6);
    } else {
      props.nextStep();
    }
  };

  const handleCreateSurveyInstance = () => {
    props.createSurveyInstance();
  };

  const handleChange = evt => {
    let val = evt.target.value;
    if (evt.target.type === "checkbox") {
      let checked = evt.target.checked;

      if (!checked) {
        const answerOptions = targetQuestion.answerOptions.filter(
          option => option.values === val
        );

        if (answerOptions.length > 0) {
          return props.submit(
            answerOptions[0].id,
            props.question.questionId,
            false,
            true
          );
        }
      } else {
        return props.submit(
          evt.target.id,
          props.question.questionId,
          undefined,
          true
        );
      }
    }

    const answerOptions = targetQuestion.answerOptions.filter(
      option => option.values === val
    );

    if (answerOptions.length > 0) {
      props.submit(
        answerOptions[0].id,
        props.question.questionId,
        undefined,
        true
      );
    } else {
      props.submit(evt.target.id, props.question.questionId, undefined, true);
    }
  };

  const handleChangeText = evt => {
    let val = evt.target.value;

    if (val.length > 5 || val.length < 5) {
      props.toggleZipCode(true);
      props.submitValue(val, props.question.questionId, false);
    } else {
      props.toggleZipCode(false);
      props.submitValue(val, props.question.questionId, true);
    }
  };

  return (
    <div className="col-md-6 offset-md-3" key={targetQuestion.questionId}>
      <div className="card-default survey-card card mt-4">
        <div className="card-header survey-card-header text-center">
          <h3>Business Survey</h3>
          <em className="fa-2x mr-2 fas fa-tasks survey-icon" />
        </div>

        <div className="mb-5 mt-5 w-75 mx-auto ">
          {props.currentStep < 6 && (
            <Slider
              defaultValue={25}
              marks={{
                25: <b className="section">Section 1</b>,
                50: "Section 2",
                75: "Section 3"
              }}
            />
          )}
          {props.currentStep >= 6 && props.currentStep < 8 && (
            <Slider
              defaultValue={50}
              marks={{
                25: "Section 1",
                50: <b className="section">Section 2</b>,
                75: "Section 3"
              }}
            />
          )}
          {props.currentStep >= 8 && (
            <Slider
              defaultValue={75}
              marks={{
                25: "Section 1",
                50: "Section 2",
                75: <b className="section">Section 3</b>
              }}
            />
          )}
        </div>

        <div className="card-body survey-question-body">
          <div className="position-relative survey-question form-group">
            <label className="col-md-12 col-form-label mb-3">
              <h4>
                {props.currentStep}. {targetQuestion.question}
              </h4>
            </label>
            <div className="col-12">
              {targetQuestion.answerOptions.length === 1 ? (
                <label>
                  <input
                    type="text"
                    name={targetQuestion.questionId}
                    value={targetQuestion.questionId.values}
                    onChange={handleChangeText}
                    className={props.isValidZipCode ? "error" : ""}
                  />
                  {props.isValidZipCode ? "   Invalid Zip Code" : ""}
                </label>
              ) : targetQuestion.sectionId === 3 ? (
                targetQuestion.questionId === 11 ? (
                  targetQuestion.answerOptions.map(option => {
                    return (
                      <p key={option.id}>
                        <label className="c-radio">
                          <input
                            type="radio"
                            name={targetQuestion.questionId}
                            checked={option.isSelected}
                            value={option.values}
                            onChange={handleChange}
                          />
                          <span className="fa fa-circle" />
                          {option.text}
                        </label>
                      </p>
                    );
                  })
                ) : (
                  targetQuestion.answerOptions.map(option => {
                    return (
                      <p key={option.id}>
                        <label className="c-checkbox">
                          <input
                            id={option.id}
                            type="checkbox"
                            name={targetQuestion.questionId}
                            checked={option.isSelected}
                            value={option.values}
                            onChange={handleChange}
                          />
                          <span className="fa fa-check" />
                          {option.text}
                        </label>
                      </p>
                    );
                  })
                )
              ) : (
                targetQuestion.answerOptions.map(option => {
                  return (
                    <p key={option.id}>
                      <label className="c-radio">
                        <input
                          type="radio"
                          name={targetQuestion.questionId}
                          checked={option.isSelected}
                          value={option.values}
                          onChange={handleChange}
                        />
                        <span className="fa fa-circle" />
                        {option.text}
                      </label>
                    </p>
                  );
                })
              )}
            </div>
          </div>
          <div className="my-4 survey-buttons">
            {props.currentStep === 1 ? (
              ""
            ) : (
              <button onClick={previous} className="btn previous float-left">
                Previous Step
              </button>
            )}

            {props.currentStep < 12 ? (
              <button
                onClick={next}
                className="btn next float-right"
                disabled={!targetQuestion.isAnswered}
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleCreateSurveyInstance}
                className="btn survey-button-submit float-right"
                disabled={!targetQuestion.isAnswered}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Question.propTypes = {
  question: PropTypes.object,
  previousStep: PropTypes.func,
  nextStep: PropTypes.func,
  goToStep: PropTypes.func,
  isDisabled: PropTypes.bool,
  isValidZipCode: PropTypes.bool,
  isActive: PropTypes.bool,
  submit: PropTypes.func,
  createSurveyInstance: PropTypes.func,
  answerOptions: PropTypes.object,
  submitValue: PropTypes.func,
  currentStep: PropTypes.number,
  step: PropTypes.number,
  answers: PropTypes.array,
  toggleZipCode: PropTypes.func,
  jumpToSeven: PropTypes.func,
  jumpToSix: PropTypes.func,
  skipToSeven: PropTypes.bool,
  skipToSix: PropTypes.bool,
  resetAnswers: PropTypes.func
};
export default Question;
