import React from "react";
import { Button, Row } from "reactstrap";
import swal from "sweetalert";
import StateProvinces from "./StateProvinces";
import AddressMap from "./AddressMap";
import * as addressService from "../../services/addressService";
import { FastField, Formik, Field } from "formik";
import * as addressSchema from "./schema/addressSchema";
import PropTypes from "prop-types";
// import logger from "../../logger";

// const _logger = logger.extend("Address");

class Address extends React.Component {
  state = {
    targetSchema: addressSchema.addSchema,
    address: {
      id: null,
      addressTypeId: 1,
      lineOne: "",
      lineTwo: "",
      city: "",
      zip: "",
      stateCode: "",
      stateId: "",
      latitude: "",
      longitude: ""
    },
    selectors: {
      stateProvinces: "",
      stateProvincesComponent: ""
    },
    isActive: false
  };

  static getDerivedStateFromProps(nextProps, state) {
    if (!state.address.id && nextProps.address.stateId !== 0) {
      return {
        address: nextProps.address
      };
    } else {
      return null;
    }
  }

  componentDidMount() {
    this.getStateProvinces();
  }

  handleAddressChange = evt => {
    let key = evt.target.name;
    let val = evt.target.value;
    this.setState(state => {
      let newAddress = { ...state.address, [key]: val };
      return {
        address: newAddress
      };
    });
  };

  verifyAddress = values => {
    addressService
      .verifyAddress(values)
      .then(this.onVerifyAddressSuccess)
      .catch(this.onVerifyAddressError);
  };

  onVerifyAddressSuccess = resp => {
    const latLong = {
      ...this.state.address,
      latitude: resp.item.geometry.location.lat,
      longitude: resp.item.geometry.location.lng
    };
    if (this.state.isActive === true) {
      this.setState(
        () => {
          return {
            isActive: false
          };
        },
        () =>
          this.setState(() => {
            return {
              address: latLong,
              isActive: true
            };
          })
      );
    } else {
      this.setState(() => {
        return {
          address: latLong,
          isActive: true
        };
      });
    }
    swal({
      text: "Please Confirm the Location on the Map",
      buttons: true
    });
  };

  onVerifyAddressError = () => {
    swal({
      title: "Error",
      text: "There was an error verifying your address, please try again.",
      icon: "warning",
      dangerMode: true
    });
  };

  uploadAddress = () => {
    if (this.state.address.id) {
      this.updateAddress();
    } else {
      let stateCode = this.state.address.stateCode;
      let stateProvinces = this.state.selectors.stateProvinces;
      let index = stateProvinces.findIndex(
        stateProvince => stateCode === stateProvince.stateCode
      );
      let newStateId = {
        ...this.state.address,
        stateId: stateProvinces[index].id
      };
      this.setState(
        () => {
          return {
            address: newStateId
          };
        },
        () => {
          addressService
            .submitAddress(this.state.address)
            .then(this.submitAddressSuccess)
            .catch(this.onError);
        }
      );
    }
  };

  submitAddressSuccess = resp => {
    swal("Address Confirmed", "Your address has been sumbitted.", "success");
    this.props.sendAddressId(resp.item);
  };

  updateAddress = () => {
    let stateCode = this.state.address.stateCode;
    let stateProvinces = this.state.selectors.stateProvinces;
    let index = stateProvinces.findIndex(
      stateProvince => stateCode === stateProvince.stateCode
    );
    let newStateId = {
      ...this.state.address,
      id: this.props.address.id,
      stateId: stateProvinces[index].id
    };
    this.setState(
      () => {
        return {
          address: newStateId
        };
      },
      () => {
        addressService
          .updateAddress(this.state.address, this.state.address.id)
          .then(this.submitAddressSuccess)
          .catch(this.onError);
      }
    );
  };

  getStateProvinces = () => {
    addressService
      .getStateProvinces()
      .then(this.onGetStateProvincesSuccess)
      .catch(this.onGetStateProvincesError);
  };

  onGetStateProvincesSuccess = resp => {
    const selectorStateProvinces = {
      ...this.state.selectors,
      stateProvinces: resp.items,
      stateProvincesComponent: resp.items.map(this.mappedstateProvinces)
    };

    const addressProps = {
      ...this.state.address,
      id: this.props.address.id,
      lineOne: this.props.address.lineOne,
      lineTwo: this.props.address.lineTwo,
      city: this.props.address.city,
      zip: this.props.address.zip,
      stateId: this.props.address.stateId,
      stateCode: this.props.address.stateCode,
      latitude: this.props.address.latitude,
      longitude: this.props.address.longitude
    };

    this.setState(() => {
      return {
        selectors: selectorStateProvinces,
        address: addressProps
      };
    });
  };

  mappedstateProvinces = stateProvince => {
    return (
      <StateProvinces key={stateProvince.id} stateProvinces={stateProvince} />
    );
  };

  render() {
    return (
      <Row>
        <div className="col-md-6">
          <div className="card-default card">
            <div className="card-header">Business Address</div>
            <div className="card-body">
              <Formik
                enableReinitialize={true}
                validationSchema={this.state.targetSchema}
                initialValues={this.state.address}
                onSubmit={this.verifyAddress}
              >
                {props => {
                  const {
                    values,
                    touched,
                    errors,
                    handleBlur,
                    handleSubmit,
                    isSubmitting
                  } = props;
                  return (
                    <div onSubmit={handleSubmit}>
                      <div className="position-relative form-group">
                        <label>Street Address</label>
                        <FastField
                          type="text"
                          name="lineOne"
                          placeholder="46548 National Trails Hwy"
                          onBlur={handleBlur}
                          onChange={this.handleAddressChange}
                          value={values.lineOne}
                          className={
                            errors.lineOne && touched.lineOne
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                        />
                        {errors.lineOne && touched.lineOne && (
                          <div className="invalid-feedback">
                            {errors.lineOne}
                          </div>
                        )}
                      </div>
                      <div className="form-group">
                        <label>Address Line 2</label>
                        <FastField
                          className="form-control"
                          type="text"
                          name="lineTwo"
                          onBlur={handleBlur}
                          onChange={this.handleAddressChange}
                          value={values.lineTwo}
                        />
                      </div>
                      <div className="form-group">
                        <label>City</label>
                        <FastField
                          type="text"
                          name="city"
                          placeholder="Newberry Springs"
                          onBlur={handleBlur}
                          onChange={this.handleAddressChange}
                          value={values.city}
                          className={
                            errors.city && touched.city
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                        />
                        {errors.city && touched.city && (
                          <p className="invalid-feedback">{errors.city}</p>
                        )}
                      </div>
                      <div className="form-group">
                        <label>State</label>
                        <Field
                          component="select"
                          name="stateCode"
                          onBlur={handleBlur}
                          onChange={this.handleAddressChange}
                          className={
                            errors.stateCode && touched.stateCode
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                        >
                          <option values={values.stateCode}>Select</option>
                          {this.state.selectors.stateProvincesComponent}
                        </Field>
                        {errors.stateCode && touched.stateCode && (
                          <p className="invalid-feedback">{errors.stateCode}</p>
                        )}
                      </div>
                      <div className="form-group">
                        <label>Zip Code</label>
                        <FastField
                          className="form-control"
                          type="text"
                          name="zip"
                          placeholder="92365"
                          onChange={this.handleAddressChange}
                          value={values.zip}
                        />
                      </div>
                      <Button
                        color="primary"
                        className="float-right"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      >
                        Address Verify
                      </Button>
                    </div>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          {this.state.isActive ? (
            <div className="card-default card">
              <div className="card-body">
                <div className="form-group">
                  <AddressMap
                    lat={Number(this.state.address.latitude)}
                    lng={Number(this.state.address.longitude)}
                  />
                </div>

                <Button
                  color="primary"
                  className="float-right"
                  onClick={this.uploadAddress}
                >
                  Confirm Address
                </Button>
              </div>
            </div>
          ) : (
            <div className="card-default card">
              <div className="card-body">
                <AddressMap
                  lat={Number(34.0337011)}
                  lng={Number(-118.2414841)}
                />
              </div>
            </div>
          )}
        </div>
      </Row>
    );
  }
}

Address.propTypes = {
  address: PropTypes.shape({
    lineOne: PropTypes.string,
    lineTwo: PropTypes.string,
    city: PropTypes.string,
    id: PropTypes.number,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    stateId: PropTypes.number,
    stateCode: PropTypes.string,
    userId: PropTypes.number,
    zip: PropTypes.string
  }),
  resourceId: PropTypes.number,
  businessId: PropTypes.number,
  sendAddressId: PropTypes.func.isRequired
};

export default Address;
