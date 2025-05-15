import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-page">
      <Row className="mb-5">
        <Col>
          <div className="jumbotron bg-light p-5 rounded">
            <h1>Candidate Verification & Coding Assessment Platform</h1>
            <p className="lead">
              A blockchain-powered platform to verify candidate credentials and
              assess coding skills in real-time.
            </p>
            <hr className="my-4" />
            <p>
              This proof of concept demonstrates certificate verification using
              Ethereum smart contracts and coding assessment with AI-powered
              evaluation.
            </p>
            <Button
              as={Link}
              to="/verify"
              variant="primary"
              size="lg"
              className="me-2"
            >
              Verify Credentials
            </Button>
            <Button as={Link} to="/code-test" variant="success" size="lg">
              Take Coding Assessment
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header as="h5">Blockchain Verification</Card.Header>
            <Card.Body>
              <Card.Title>Secure & Immutable</Card.Title>
              <Card.Text>
                Our platform uses Ethereum blockchain technology to securely
                verify education credentials, certifications, and work history.
              </Card.Text>
              <Button as={Link} to="/verify" variant="outline-primary">
                Learn More
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4">
            <Card.Header as="h5">Coding Assessment</Card.Header>
            <Card.Body>
              <Card.Title>Real-Time Evaluation</Card.Title>
              <Card.Text>
                Take a coding test in our integrated environment and get
                immediate feedback on your solution's correctness, efficiency,
                and code quality.
              </Card.Text>
              <Button as={Link} to="/code-test" variant="outline-success">
                Start Coding
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4">
            <Card.Header as="h5">Comprehensive Reports</Card.Header>
            <Card.Body>
              <Card.Title>Detailed Analysis</Card.Title>
              <Card.Text>
                Receive detailed reports on both credential verification and
                coding performance, providing a complete picture of candidate
                qualifications.
              </Card.Text>
              <Button as={Link} to="/results" variant="outline-info">
                View Sample
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
