import { FastField, Formik, Field } from "formik";
import React from "react";
import { Button } from "reactstrap";
import * as entrepreneursSchema from "./schemas/entrepreneursSchema.js";
import * as entrepreneursService from "../../services/entrepreneursService.js";
//import { uploadFile } from "../../services/filesService";
import swal from "sweetalert";
import PropTypes from "prop-types";
import FileUpload from "../surveys/SurveyFileUpload";
import { uploadFile } from "../../services/filesService";
import Type from "./Type";
// import logger from "../../logger";

// const _logger = logger.extend("EntrepreneursForm");

class EntrepreneursForm extends React.Component {
  state = {
    targetSchema: entrepreneursSchema.addSchema,
    selectors: {
      companyStatus: [],
      companyStatusComponent: [],
      industryType: [],
      industryTypeComponent: []
    },
    form: {
      industryTypeId: "",
      companyStatusId: "",
      hasSecurityClearance: "",
      hasInsurance: "",
      hasBonds: "",
      specializedEquipment: "",
      imageUrl:
        "https://sabioawsbucket2.s3.us-west-2.amazonaws.com/sabioawsbucket2053ab817-abf2-4cc7-867f-dd284ccb6cbe_pexels-photo-958173.jpeg",
      id: ""
    }
  };

  componentDidMount() {
    if (this.props.match.params.id) {
      const { id } = this.props.match.params;
      entrepreneursService
        .getById(id)
        .then(this.onGetEntrepreneurByIdSuccess)
        .catch(this.onGetEntrepreneurByIdError);
    }
    entrepreneursService
      .getAllTypes()
      .then(this.onGetAllSuccess)
      .catch(this.onError);
  }
  onGetAllSuccess = resp => {
    const newSelectors = {
      companyStatus: resp.item.companyStatuses,
      companyStatusComponent: resp.item.companyStatuses.map(
        this.mappedCompanyStatus
      ),
      industryType: resp.item.industryTypes,
      industryTypeComponent: resp.item.industryTypes.map(
        this.mappedIndustryType
      )
    };
    this.setState(() => {
      return {
        ...this.state,
        selectors: newSelectors
      };
    });
  };
  onGetEntrepreneurByIdSuccess = resp => {
    this.setState(() => {
      const form = {
        industryTypeId: resp.item.industryType.id,
        companyStatusId: resp.item.companyStatus.id,
        hasSecurityClearance: resp.item.hasSecurityClearance,
        hasInsurance: resp.item.hasInsurance,
        hasBonds: resp.item.hasBonds,
        specializedEquipment: resp.item.specializedEquipment,
        imageUrl: resp.item.imageUrl,
        id: resp.item.id
      };
      return {
        form
      };
    });
  };

  clickHandler = (values, { resetForm }) => {
    const { id } = this.props.match.params;
    if (id) {
      entrepreneursService
        .update(id, values)
        .then(this.onUpdateEntrepreneurByIdSuccess)
        .catch(this.onError)
        .then(resetForm(this.state.form));
    } else {
      entrepreneursService
        .insert(values)
        .then(this.onInsertEntrepreneurSuccess)
        .catch(this.onError)
        .then(resetForm(this.state.form));
    }
  };

  onUpdateEntrepreneurByIdSuccess = () => {
    swal({
      title: "Update Success!",
      text: "Thank you for updating the form",
      icon: "success",
      button: "Ok"
    }).then(this.props.history.push(`/admin/Entrepreneurs/`));
  };

  onInsertEntrepreneurSuccess = () => {
    swal({
      title: "Submit Success!",
      text: "Thank you for submitting the form",
      icon: "success",
      button: "Ok"
    }).then(this.props.history.push(`/admin/Entrepreneurs/`));
  };

  onError = () => {
    swal({
      title: "Uh Oh",
      text: "Please go back and complete the form",
      icon: "warning",
      dangerMode: true
    });
  };

  loadFile = file => {
    this.setState({
      currentFile: file
    });
  };

  uploadFile = (loaded, currentValues) => {
    if (loaded) {
      const fd = new FormData();
      fd.append("file", loaded, loaded.name);
      uploadFile(fd)
        .then(resp => {
          const url = currentValues;
          url.imageUrl = resp.items[0];
          this.setState(() => {
            return {
              ...this.state.form,
              imageUrl: resp.items[0]
            };
          });
        })
        .then(
          swal({
            title: "Sweet!",
            text: "Your file has been uploaded!",
            icon: "success",
            timer: 1000,
            button: false
          })
        )
        .catch(this.onError);
    }
  };

  mappedIndustryType = iType => {
    return (
      <Type
        typeState={this.state.selectors.industryType}
        key={iType.id}
        type={iType}
      />
    );
  };

  mappedCompanyStatus = cStatus => {
    return (
      <Type
        typeState={this.state.selectors.companyStatus}
        key={cStatus.id}
        type={cStatus}
      />
    );
  };

  render() {
    return (
      <div className="content-wrapper">
        <Formik
          enableReinitialize={true}
          validationSchema={this.state.targetSchema}
          initialValues={this.state.form}
          onSubmit={this.clickHandler}
        >
          {props => {
            const {
              values,
              touched,
              errors,
              handleBlur,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              isValid
            } = props;
            return (
              <div className="row justify-content-center">
                <div className="card-default card col-md-8">
                  <div className="card-body">
                    <div className="row font-weight-bold">
                      <h3 className="pr-2">Aspiring Entrepreneurs</h3>
                      <p className="text-muted"> *Required</p>
                    </div>
                    <form className="pt-4" onSubmit={handleSubmit}>
                      <div className="position-relative form-group">
                        <label htmlFor="industryTypeId">Industry Type</label>
                        <Field
                          placeholder="Enter Industry Type Id"
                          component="select"
                          name="industryTypeId"
                          className={
                            errors.industryTypeId && touched.industryTypeId
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                        >
                          <option values={values.industryTypeId}>Select</option>
                          {this.state.selectors.industryTypeComponent}
                        </Field>
                        {errors.industryTypeId && touched.industryTypeId && (
                          <p className="invalid-feedback">
                            {errors.industryTypeId}
                          </p>
                        )}
                      </div>
                      <div className="position-relative form-group">
                        <label htmlFor="companyStatusId">Company Status</label>
                        <Field
                          placeholder="Enter Company Status Id"
                          component="select"
                          name="companyStatusId"
                          className={
                            errors.companyStatusId && touched.companyStatusId
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                        >
                          <option values={values.companyStatusId}>
                            Select
                          </option>
                          {this.state.selectors.companyStatusComponent}
                        </Field>
                        {errors.companyStatusId && touched.companyStatusId && (
                          <p className="invalid-feedback">
                            {errors.companyStatusId}
                          </p>
                        )}
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <div className="position-relative form-group">
                            <label className="pl-3 row">
                              Has Security Clearance?{" "}
                            </label>
                            <div className="col-md-10">
                              <label className="c-radio">
                                <FastField
                                  checked={values.hasSecurityClearance === true}
                                  value={values.hasSecurityClearance}
                                  type="radio"
                                  name="hasSecurityClearance"
                                  onChange={() => {
                                    setFieldValue("hasSecurityClearance", true);
                                  }}
                                />
                                <span className="fa fa-circle" />
                                Yes
                              </label>
                              <label className="c-radio">
                                <FastField
                                  checked={
                                    values.hasSecurityClearance === false
                                  }
                                  value={values.hasSecurityClearance}
                                  type="radio"
                                  name="hasSecurityClearance"
                                  onChange={() => {
                                    setFieldValue(
                                      "hasSecurityClearance",
                                      false
                                    );
                                  }}
                                />
                                <span className="fa fa-circle" />
                                No
                              </label>
                            </div>
                          </div>
                          <div className="position-relative form-group">
                            <label className="pl-3 row">Has Insurance? </label>
                            <div className="col-md-10">
                              <label className="c-radio">
                                <FastField
                                  checked={values.hasInsurance === true}
                                  value={values.hasInsurance}
                                  type="radio"
                                  name="hasInsurance"
                                  onChange={() => {
                                    setFieldValue("hasInsurance", true);
                                  }}
                                />
                                <span className="fa fa-circle" />
                                Yes
                              </label>
                              <label className="c-radio">
                                <FastField
                                  checked={values.hasInsurance === false}
                                  value={values.hasInsurance}
                                  type="radio"
                                  name="hasInsurance"
                                  onChange={() => {
                                    setFieldValue("hasInsurance", false);
                                  }}
                                />
                                <span className="fa fa-circle" />
                                No
                              </label>
                            </div>
                          </div>
                          <div className="position-relative form-group">
                            <label className="pl-3 row">Has Bonds? </label>
                            <div className="col-md-10">
                              <label className="c-radio">
                                <FastField
                                  checked={values.hasBonds === true}
                                  value={values.hasBonds}
                                  type="radio"
                                  name="hasBonds"
                                  onChange={() => {
                                    setFieldValue("hasBonds", true);
                                  }}
                                />
                                <span className="fa fa-circle" />
                                Yes
                              </label>
                              <label className="c-radio">
                                <FastField
                                  checked={values.hasBonds === false}
                                  value={values.hasBonds}
                                  type="radio"
                                  name="hasBonds"
                                  onChange={() => {
                                    setFieldValue("hasBonds", false);
                                  }}
                                />
                                <span className="fa fa-circle" />
                                No
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="position-relative form-group">
                            <label htmlFor="specializedEquipment">
                              Specialized Equipment{" "}
                            </label>
                            <FastField
                              onBlur={handleBlur}
                              component="textarea"
                              name="specializedEquipment"
                              style={{ height: "160px" }}
                              value={values.specializedEquipment}
                              className={
                                errors.specializedEquipment &&
                                touched.specializedEquipment
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                            />
                            {errors.specializedEquipment &&
                              touched.specializedEquipment && (
                                <p className="invalid-feedback">
                                  {errors.specializedEquipment}
                                </p>
                              )}
                          </div>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col">
                          <img
                            className="ml-auto img-thumbnail rounded-circle thumb96 img-fluid float-left"
                            alt=""
                            src={
                              values.imageUrl
                                ? values.imageUrl
                                : "https://tinyurl.com/y26qjlvw"
                            }
                          />
                        </label>
                        <div className="col-9">
                          <FileUpload
                            name="imageUrl"
                            currentFile={this.state.currentFile}
                            uploadFile={this.uploadFile}
                            loadFile={this.loadFile}
                            currentValues={values}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col">
                          <Button
                            type="submit"
                            disabled={isSubmitting || !isValid}
                            onClick={handleSubmit}
                            color="success"
                            size="lg"
                            target="_blank"
                            className="float-right"
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            );
          }}
        </Formik>
      </div>
    );
  }
}

EntrepreneursForm.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    }).isRequired
  }).isRequired,
  history: PropTypes.object
};

export default EntrepreneursForm;
