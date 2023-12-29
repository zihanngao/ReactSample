import React from "react";
import "./App.css";
import Section from "./Section";
import StarRating from "./StarRating";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Accordion from "react-bootstrap/Accordion";
import {Image} from "react-bootstrap";

class Course extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false, // whether the course is expanded (i.e. description is shown) or not
      showModal: false, // whether to display the modal that shows sections and subsections
    };
  }

  getSections() {
    // Maps the sections of the course to a list of Section components
    let sections = [];
    let course = this.props.courseKey;

    for (const section of Object.values(this.props.data.sections)) {
      sections.push(
        <Section
          key={section.number}
          data={section}
          courseKey={course}
          sectionKey={section.number}
        />
      );
    }

    return sections;
  }

  openModal() {
    // Open the modal that shows sections and subsections
    this.setState({ showModal: true });
  }

  closeModal() {
    // Close the modal that shows sections and subsections
    this.setState({ showModal: false });
  }

  setExpanded(value) {
    // Sets the expanded state of the course
    this.setState({ expanded: value });
  }

  getCourseButton() {
    // Returns a button that adds/remove the course to/from the cart
    if (!this.props.cartCourses) return;

    let cartCourses = this.props.cartCourses;
    let course = this.props.data;

    let buttonOnClick = () => this.addCourse(course);
    let buttonText = "Add Course";

    if (cartCourses.some((c) => c.number === course.number)) {
      buttonOnClick = () => this.removeCourse(course);
      buttonText = "Remove Course";
    }

    return (
      <Button className="me-1" variant="secondary" onClick={buttonOnClick}>
        {buttonText}
      </Button>
    );
  }

  getExpansionButton() {
    // Returns a button that expands/collapses the course description
    let buttonText = this.state.expanded ?  "▲" :  "▼";
    let buttonOnClick = () => this.setExpanded(!this.state.expanded);

    return (
      <Button
        variant="outline-dark"
        onClick={buttonOnClick}
      >
        {buttonText}
      </Button>
    );
  }

  addCourse = () => {
    // Adds the course to the cart
    this.props.addCartCourse(this.props.data);
  };

  removeCourse(course) {
    // Removes the course from the cart
    this.props.removeCartCourse(course);
  }

  getRequisites() {
    // Returns the requisites of the course as a formatted string
    let requisites = this.props.data.requisites;
    let reqList = [];
    let reqString = "";

    if (requisites.length > 0) {
      requisites.forEach((req) => {
        reqList.push("(" + req.join(" OR ") + ")");
      });
    } else {
      reqList.push("None");
    }
    reqString = reqList.join(" AND ");

    return reqString;
  }

  getKeywords() {
    // Returns the keywords of the course as a formatted string
    return this.props.data.keywords.join(", ");
  }

  showStarRating() {
    // Shows the star rating if it's under Completed Courses tab
    if (this.props.ratingMode === true) {
      return (
        <StarRating data={this.props.data} setRating={this.props.setRating} />
      );
    }
  }

  render() {
    let course = this.props.data.number;
    let name = this.props.data.name;
    let credits = this.props.data.credits;
    let description = this.props.data.description;
    // let imgLink = this.props.imgs.iLink
    // console.log(this.props.images)

    return (
      <Card className="col-8 mb-2 p-2 courseCard">
        {/* <Card.Img as={Image} src={"https://leverageedu.com/blog/wp-content/uploads/2020/04/Media-Psychology.jpg"} className="cardImg img-square-wrapper"/> */}
        <Card.Img src="https://leverageedu.com/blog/wp-content/uploads/2020/04/Media-Psychology.jpg" className="cardImg img-square-wrapper"/>
       <div className="cardbody col-10">
        <Card.Title className="d-flex justify-content-between">
          <a href="#" classname="courseName" onClick={()=>this.openModal()}> {name} </a>
          <div>
            {this.getCourseButton()}
            {this.getExpansionButton()}
          </div>
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {course} · {credits + " Credits"}
        </Card.Subtitle>

        {this.state.expanded && <p>{description}</p>}

        {!this.props.compactView && (
          <>
            <p><span><strong>Requisites: </strong> {this.getRequisites()}</span></p>
            <p><span>
              <u>Keywords:</u> {this.getKeywords()}
            </span></p>
          </>
        )}
     

        {/* Completed courses do not have sections/subsections */}
        {/* {!this.props.ratingMode && (
          <Button className="mt-2" variant="dark" onClick={() => this.openModal()}>
            View sections and subsections
          </Button>
        )} */}

        {/* Star ratings are only shown when it's rendered under Completed Courses tab */}
        {this.showStarRating()}

        </div>

        {/* Modal that shows sections and subsections */}
        <Modal
          show={this.state.showModal}
          onHide={() => this.closeModal()}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>{this.props.data.name}</Modal.Title>
          </Modal.Header>

          <Accordion defaultActiveKey={this.props.data.sections[0].number}>
            {this.getSections()}
          </Accordion>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.closeModal()}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Card>
    );
  }
}

export default Course;
