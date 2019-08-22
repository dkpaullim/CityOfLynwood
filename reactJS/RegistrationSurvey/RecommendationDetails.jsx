import React from "react";
import "./recommendations.css";
import PropTypes from "prop-types";
import { getResourceById } from "../../services/resourcesService";
import "./recDetails.css";
import { Row, Col } from "reactstrap";
import * as addressService from "../../services/addressService";
import AddressMap from "../address/AddressMap";
import { displayPhoneNum } from "../../services/displayPhoneNumService.js";

import logger from "../../logger";
const _logger = logger.extend("RecommendationDetails");

class RecommendationDetails extends React.Component {
  state = {
    form: {
      id: "",
      companyName: "",
      description: "",
      contactName: "",
      contactEmail: "",
      businessTypeName: "",
      industryTypeName: "",
      phone: "",
      siteUrl: "",
      imageUrl: "",
      categories: []
    },
    address: {
      city: "",
      latitude: "",
      longitude: "",
      lineOne: "",
      lineTwo: "",
      stateCode: "",
      zip: ""
    },
    isActive: false
  };

  componentDidMount() {
    const id = this.props.location.state.id;
    getResourceById(id)
      .then(this.onGetResourceByIdSuccess)
      .catch(this.onGetResourceByIdError);
    addressService
      .getAddressByResourceId(id)
      .then(this.onGetAddressByResourceIdSuccess)
      .catch(this.onGetAddressByResourceIdError);
  }

  onGetResourceByIdSuccess = resp => {
    const form = {
      id: resp.item.id,
      companyName: resp.item.companyName,
      description: resp.item.description,
      contactName: resp.item.contactName,
      contactEmail: resp.item.contactEmail,
      businessTypeName: resp.item.businessType.name,
      industryTypeName: resp.item.industryType.name,
      phone: resp.item.phone,
      siteUrl: resp.item.siteUrl,
      imageUrl: resp.item.imageUrl,
      categories: resp.item.categories
    };
    this.setState({
      form
    });
  };

  mapCate = (cate, index) => {
    const length = this.state.form.categories.length;
    if (index === length - 1) {
      return cate.name;
    } else {
      return cate.name + " / ";
    }
  };

  onGetAddressByResourceIdSuccess = resp => {
    const address = {
      city: resp.item.city,
      latitude: resp.item.latitude,
      longitude: resp.item.longitude,
      lineOne: resp.item.lineOne,
      lineTwo: resp.item.lineTwo,
      stateCode: resp.item.stateCode,
      zip: resp.item.zip
    };
    this.setState(
      {
        address,
        isActive: true
      },
      () => {
        _logger(this.state.address);
      }
    );
  };

  render() {
    return (
      <React.Fragment>
        <div className="resource">
          <div className="container recommendations-card resourceDetails">
            <div className="rag-fadeIn-enter-done">
              <div
                className="bg-cover resourceDetailsImg"
                style={{
                  backgroundImage: "url(img/resourceDetails5.jpg)",
                  height: 250
                }}
              />
              <div className="p-4 text-center text-black">
                <div className="img-padding">
                  <img
                    className="img-thumbnail rdProfile"
                    src={this.state.form.imageUrl}
                    alt="Avatar"
                  />
                </div>
                <p>{""}</p>
                <h3 className="m-0">{this.state.form.companyName}</h3>
                <p>{""}</p>
                <p>{this.state.form.description}</p>
              </div>
              <div className="text-center bg-gray-dark p-3 mb-4">
                <Row>
                  <Col xs="4" className="br">
                    <h3 className="m-0">Business Type: </h3>
                    <p className="m-0">
                      <span className="d-none d-md-inline">
                        {this.state.form.businessTypeName}
                      </span>
                    </p>
                  </Col>
                  <Col xs="4" className="br">
                    <h3 className="m-0">Industry Type: </h3>
                    <p className="m-0">{this.state.form.industryTypeName}</p>
                  </Col>
                  <Col xs="4">
                    <h3 className="m-0">Categories: </h3>
                    <p className="m-0">
                      {this.state.form.categories === null
                        ? "Categories not selected"
                        : this.state.form.categories.map(this.mapCate)}
                    </p>
                  </Col>
                </Row>
              </div>
              <div className="tb-padding">
                <div className="card-body">
                  <table className="table bb">
                    <tbody>
                      <tr>
                        <td>
                          <strong>Web Site: </strong>
                        </td>
                        <td>
                          {" "}
                          <a
                            href={`${this.state.form.siteUrl}`}
                            target={"_blank"}
                          >
                            {this.state.form.siteUrl}
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Contact Name: </strong>
                        </td>
                        <td>{this.state.form.contactName}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Contact Email: </strong>
                        </td>
                        <td>{this.state.form.contactEmail}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Contact Number: </strong>
                        </td>
                        <td>{displayPhoneNum(this.state.form.phone)}</td>
                      </tr>
                    </tbody>
                  </table>

                  {this.state.isActive ? (
                    <Row className="col-md-10 mx-auto">
                      <div className="col-md-6">
                        <div id="getTouch">
                          <h2>Get in Touch</h2>
                          <h4 className="h4-ad2">
                            You need more information? Check what other persons
                            are saying about our services. They are very happy
                            with their services.
                          </h4>
                        </div>
                        <div id="rd-address">
                          <strong>
                            <i className="fa-2x fas fa-map-marker-alt" />
                            <span className="find-us">
                              Find us at the office:{" "}
                            </span>
                          </strong>
                          <p />
                          <h4 className="h4-ad">
                            {this.state.address.lineOne}{" "}
                            {this.state.address.lineTwo}{" "}
                          </h4>
                          <h4 className="h4-ad">
                            {this.state.address.city}
                            {" , "}
                            {this.state.address.stateCode}{" "}
                            {this.state.address.zip}
                          </h4>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <AddressMap
                          lat={Number(this.state.address.latitude)}
                          lng={Number(this.state.address.longitude)}
                        />
                      </div>
                    </Row>
                  ) : (
                    "Address Not Submitted"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

RecommendationDetails.propTypes = {
  location: PropTypes.object
};

export default RecommendationDetails;
