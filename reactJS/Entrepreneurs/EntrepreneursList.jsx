import React from "react";
import * as entrepreneursService from "../../services/entrepreneursService.js";
import Entrepreneur from "./Entrepreneur";
import PropTypes from "prop-types";
import swal from "sweetalert";
import {
  Col,
  Row,
  Button,
  InputGroupAddon,
  InputGroup,
  Input
} from "reactstrap";

// import logger from "../../logger";

// const _logger = logger.extend("EntrepreneursList");

class EntrepreneursList extends React.PureComponent {
  state = {
    entrepreneurCards: [],
    hasPreviousPage: false,
    hasNextPage: false,
    pageIndex: 0,
    pageSize: 6,
    query: "",
    totalPages: 0,
    pageNumber: 0
  };

  componentDidMount() {
    entrepreneursService
      .displayEntrepreneurs(this.state.pageIndex, this.state.pageSize)
      .then(this.onDisplayEntrepreneurSuccess)
      .catch(this.onError);
  }

  onDisplayEntrepreneurSuccess = resp => {
    this.setState(() => {
      return {
        hasPreviousPage: resp.item.hasPreviousPage,
        hasNextPage: resp.item.hasNextPage,
        totalPages: resp.item.totalPages,
        entrepreneurCards: resp.item.pagedItems.map(this.mapEntrepreneur)
      };
    });
  };

  handleSearchChange = evt => {
    this.setState({
      query: evt.target.value
    });
  };

  keyPress = e => {
    if (e.keyCode === 13) {
      let pageNumber = 0;
      entrepreneursService
        .searchEntrepreneurs(pageNumber, this.state.pageSize, this.state.query)
        .then(this.onSearchEntrepreneurSuccess)
        .catch(this.onSearchEntrepreneurError);
    }
  };

  clearSearch = () => {
    this.setState({ query: "", pageIndex: 0, pageNumber: 0 }, () => {
      entrepreneursService
        .displayEntrepreneurs(this.state.pageIndex, this.state.pageSize)
        .then(this.onDisplayEntrepreneurSuccess)
        .catch(this.onError);
    });
  };

  searchEntrepreneurs = () => {
    let pageNumber = 0;
    entrepreneursService
      .searchEntrepreneurs(pageNumber, this.state.pageSize, this.state.query)
      .then(this.onDisplayEntrepreneurSuccess)
      .catch(this.onSearchEntrepreneurError);
  };

  onSearchEntrepreneurError = () => {
    swal({
      title: "Search not found.",
      icon: "warning",
      dangerMode: true
    });
  };

  editEntre = id => {
    this.props.history.push(`/admin/entrepreneurs/edit/${id}`);
  };

  deleteEntre = id => {
    swal({
      title: "Are you sure?",
      text:
        "Once deleted, you will not be able to recover this entrepreneur file.",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        entrepreneursService
          .deleteEntrepreneur(id)
          .then(this.onDeleteSuccess(id))
          .catch(this.onDeleteError);
        swal("Your entrepreneur file has been deleted.", {
          icon: "success"
        });
      } else {
        swal("Your entrepreneur file is safe.");
      }
    });
  };

  onDeleteSuccess = id => {
    this.setState(prevState => {
      const entrepreneurs = [...prevState.entrepreneurCards];
      const index = entrepreneurs.findIndex(
        entre => entre.props.entrepreneur.id === id
      );
      entrepreneurs.splice(index, 1);
      return {
        entrepreneurCards: entrepreneurs
      };
    });
  };

  mapEntrepreneur = entrepreneur => {
    return (
      <Entrepreneur
        key={entrepreneur.id}
        entrepreneur={entrepreneur}
        edit={this.editEntre}
        delete={this.deleteEntre}
        currentUser={this.props.currentUser}
      />
    );
  };

  prevClickHandler = evt => {
    evt.preventDefault();

    if (this.state.hasPreviousPage && this.state.pageIndex >= 1) {
      this.setState(
        () => {
          return {
            pageIndex: this.state.pageIndex - 1
          };
        },
        () => {
          if (this.state.query) {
            this.setState(
              () => {
                return { pageNumber: this.state.pageNumber - 1 };
              },
              () => {
                if (this.state.pageNumber >= 0) {
                  entrepreneursService
                    .searchEntrepreneurs(
                      this.state.pageNumber,
                      this.state.pageSize,
                      this.state.query
                    )
                    .then(this.onDisplayEntrepreneurSuccess)
                    .catch(this.onError);
                }
              }
            );
          } else {
            entrepreneursService
              .displayEntrepreneurs(this.state.pageIndex, this.state.pageSize)
              .then(this.onDisplayEntrepreneurSuccess)
              .catch(this.onError);
          }
        }
      );
    }
  };

  nextClickHandler = evt => {
    evt.preventDefault();
    if (this.state.hasNextPage) {
      this.setState(
        () => {
          return {
            pageIndex: this.state.pageIndex + 1
          };
        },
        () => {
          if (this.state.query) {
            this.setState(
              () => {
                return { pageNumber: this.state.pageNumber + 1 };
              },
              () => {
                if (this.state.totalPages > this.state.pageNumber) {
                  entrepreneursService
                    .searchEntrepreneurs(
                      this.state.pageNumber,
                      this.state.pageSize,
                      this.state.query
                    )
                    .then(this.onDisplayEntrepreneurSuccess)
                    .catch(this.onError);
                }
              }
            );
          } else if (this.state.pageIndex < this.state.totalPages) {
            entrepreneursService
              .displayEntrepreneurs(this.state.pageIndex, this.state.pageSize)
              .then(this.onDisplayEntrepreneurSuccess)
              .catch(this.onError);
          }
        }
      );
    }
  };

  onError = () => {
    swal({
      title: "Uh Oh, something is wrong with the server",
      icon: "warning",
      dangerMode: true
    });
  };

  keyPress = e => {
    if (e.keyCode === 13) {
      let pageNumber = 0;
      entrepreneursService
        .searchEntrepreneurs(pageNumber, this.state.pageSize, this.state.query)
        .then(this.onDisplayEntrepreneurSuccess)
        .catch(this.onError);
    }
  };
  render() {
    return (
      <div className="rag-fadeIn-enter-done">
        <div className="content-wrapper">
          <Row className="mx-0">
            <InputGroup className="mt-3">
              <Input
                bsSize="lg"
                placeholder="Search..."
                onChange={this.handleSearchChange}
                name="query"
                onKeyDown={this.keyPress}
                value={this.state.query}
              />
              <InputGroupAddon addonType="append">
                <Button
                  outline
                  color="secondary"
                  onClick={this.searchEntrepreneurs}
                >
                  <em className="fas fa-search" />
                </Button>
              </InputGroupAddon>
              <InputGroupAddon addonType="append">
                <Button outline color="secondary" onClick={this.clearSearch}>
                  <em className="fas fa-undo-alt" />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </Row>
          <div className="row mt-2">{this.state.entrepreneurCards}</div>

          <div className="container button-margin">
            <Row>
              <Col className="prevButton" xs="3">
                <Button
                  className="button4 list-card button-round"
                  size="lg"
                  block
                  onClick={this.prevClickHandler}
                >
                  Previous
                </Button>
              </Col>
              <Col xs="6" />
              <Col className="nextButton" xs="3">
                <Button
                  className="button4 list-card button-round"
                  size="lg"
                  block
                  onClick={this.nextClickHandler}
                >
                  Next
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

EntrepreneursList.propTypes = {
  history: PropTypes.object,
  currentUser: PropTypes.object
};

export default EntrepreneursList;
