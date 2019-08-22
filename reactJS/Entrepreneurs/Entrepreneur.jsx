import React from "react";
import "../resources/resources.css";
import PropTypes from "prop-types";
// import logger from "../../logger";
import { CardImg } from "reactstrap";
// const _logger = logger.extend("EntrepreneursList");

const Entrepreneur = props => {
  const clickHandlerEdit = () => {
    props.edit(props.entrepreneur.id);
  };

  const clickHandlerDelete = () => {
    props.delete(props.entrepreneur.id);
  };
  return (
    <div className="col-lg-4">
      <div
        className="card card-default col-lg-12 mt-3 list-card"
        key={props.entrepreneur.id}
      >
        <div className="card-body text-center">
          <CardImg
            className="img-thumbnail rounded-circle thumb128"
            data-object-fit="cover"
            // className="sizing"
            top
            src={props.entrepreneur.imageUrl}
            alt="Card cap"
          />
          <div className="py-4" />
          <h3 className="m-0 text-bold">
            {props.entrepreneur.firstName} {props.entrepreneur.lastName}
          </h3>
          <div className="my-3">
            <div />
            <div>
              <strong>Email: </strong> {props.entrepreneur.email}
            </div>
            <div>
              <strong>Industry Type: </strong>{" "}
              {props.entrepreneur.industryType.name}
            </div>
            <div>
              <strong>Company Status: </strong>
              {props.entrepreneur.companyStatus.name}
            </div>
            <div>
              <strong>Has Security Clearance: </strong>
              {`${props.entrepreneur.hasSecurityClearance ? "Yes" : "No"}`}
            </div>
            <div>
              <strong>Has Insurance: </strong>
              {`${props.entrepreneur.hasInsurance ? "Yes" : "No"}`}
            </div>
            <div>
              <strong>Has Bonds: </strong>
              {`${props.entrepreneur.hasBonds ? "Yes" : "No"}`}
            </div>
            <div>
              <strong>Specialized Equipment: </strong>
              {props.entrepreneur.specializedEquipment}
            </div>
          </div>
          {props.currentUser.roles.includes("Admin") ? (
            <div>
              <button
                className="btn btn-secondary float-left list-card button5"
                onClick={clickHandlerEdit}
              >
                <em className="fa-1x fas fa-edit" />
              </button>
              <button
                onClick={clickHandlerDelete}
                className="btn btn-secondary float-right list-card button5"
              >
                <em className="fa-1x fas fa-trash-alt" />
              </button>
            </div>
          ) : (
            <div className="d-none" />
          )}
        </div>
      </div>
    </div>
  );
};
Entrepreneur.propTypes = {
  entrepreneur: PropTypes.shape({
    imageUrl: PropTypes.any,
    hasSecurityClearance: PropTypes.bool.isRequired,
    hasInsurance: PropTypes.bool.isRequired,
    hasBonds: PropTypes.bool.isRequired,
    specializedEquipment: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    industryType: PropTypes.object.isRequired,
    companyStatus: PropTypes.object.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }),
  edit: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired,
  currentUser: PropTypes.object
};
export default React.memo(Entrepreneur);
