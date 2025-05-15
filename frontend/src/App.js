import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// Import components
import Home from "./components/Home";
import VerifyCredentials from "./components/VerifyCredentials";
import CodingAssessment from "./components/CodingAssessment";
import Results from "./components/Results";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/">
              CV-CAP
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/verify">
                  Verify Credentials
                </Nav.Link>
                <Nav.Link as={Link} to="/code-test">
                  Coding Assessment
                </Nav.Link>
                <Nav.Link as={Link} to="/results">
                  Results
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container className="mt-4">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/verify">
              <VerifyCredentials />
            </Route>
            <Route path="/code-test">
              <CodingAssessment />
            </Route>
            <Route path="/results">
              <Results />
            </Route>
          </Switch>
        </Container>

        <footer className="bg-light text-center text-lg-start mt-5">
          <div className="text-center p-3">
            © 2025 CV-CAP: Candidate Verification and Coding Assessment Platform
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
