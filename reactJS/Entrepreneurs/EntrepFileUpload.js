import React from "react";
import { CardBody, CardHeader, Button } from "reactstrap";
import PropTypes from "prop-types";

// import logger from "../../logger";
// const _logger = logger.extend("FileUpload");

const EntrepFileUpload = props => {
  const handlePost = () => {
    props.uploadFile(props.currentFile, props.currentValues);
  };

  const loading = e => {
    props.loadFile(e.target.files[0]);
  };

  return (
    <CardHeader>
      <input type="file" onChange={loading} />
      <span>
        <Button
          color="primary"
          size="sm"
          className=" float-right"
          onClick={handlePost}
        >
          Upload
        </Button>
      </span>
      <CardBody />
    </CardHeader>
  );
};

EntrepFileUpload.propTypes = {
  currentValues: PropTypes.object,
  currentFile: PropTypes.object,
  loadFile: PropTypes.func,
  uploadFile: PropTypes.func
};

export default EntrepFileUpload;
