import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Card,
  Alert,
  Spinner,
  Row,
  Col,
  Tab,
  Tabs,
} from "react-bootstrap";
import MonacoEditor from "react-monaco-editor";
import axios from "axios";
import { useHistory } from "react-router-dom";

const CodingAssessment = () => {
  const history = useHistory();
  const [problemType, setProblemType] = useState("factorial");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes
  const [isStarted, setIsStarted] = useState(false);

  // Default code template for factorial problem
  const factorialTemplate = `# Calculate factorial of a number
# Input: a single integer
# Output: the factorial of the input

def factorial(n):
    # Your code here
    pass

if __name__ == "__main__":
    import sys
    n = int(sys.argv[1])
    result = factorial(n)
    print(result)
`;

  // Set default code when problem type changes
  useEffect(() => {
    if (problemType === "factorial") {
      setCode(factorialTemplate);
    }
  }, [problemType]);

  // Timer countdown effect
  useEffect(() => {
    if (!isStarted) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          handleSubmitCode();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleEditorChange = (newValue) => {
    setCode(newValue);
  };

  const handleStartTest = () => {
    setIsStarted(true);
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/submit-coding-test", {
        code,
        problemType,
      });

      // Store the results in session storage
      sessionStorage.setItem("codingResults", JSON.stringify(response.data));

      // Redirect to results page
      history.push("/results");
    } catch (err) {
      setError(
        "Error submitting code: " + (err.response?.data?.message || err.message)
      );
      setLoading(false);
    }
  };

  // Monaco editor options
  const editorOptions = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: "line",
    automaticLayout: true,
  };

  return (
    <div className="coding-assessment-page">
      <h2 className="mb-4">Coding Assessment</h2>

      {!isStarted ? (
        <Card>
          <Card.Header>Instructions</Card.Header>
          <Card.Body>
            <Card.Title>Python Coding Test</Card.Title>
            <Card.Text>
              <p>
                This assessment will test your Python programming skills. You
                will be given a problem to solve:
              </p>
              <ul>
                <li>
                  <strong>Problem Type:</strong> Calculate the factorial of a
                  number
                </li>
                <li>
                  <strong>Time Limit:</strong> 30 minutes
                </li>
                <li>
                  <strong>Evaluation Criteria:</strong> Correctness, code
                  quality, efficiency
                </li>
              </ul>
              <p>
                During the test, your coding process will be monitored,
                including code changes, time spent on each part, and debugging
                attempts.
              </p>
            </Card.Text>
            <Button variant="primary" onClick={handleStartTest}>
              Start Test
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <>
          <Row>
            <Col md={4}>
              <Card className="mb-4">
                <Card.Header>Problem Description</Card.Header>
                <Card.Body>
                  <Card.Title>Factorial Calculation</Card.Title>
                  <Card.Text>
                    <p>
                      Write a function to calculate the factorial of a given
                      number.
                    </p>
                    <p>
                      <strong>Definition:</strong> The factorial of a
                      non-negative integer n, denoted by n!, is the product of
                      all positive integers less than or equal to n.
                    </p>
                    <p>
                      <strong>Examples:</strong>
                    </p>
                    <ul>
                      <li>5! = 5 × 4 × 3 × 2 × 1 = 120</li>
                      <li>0! = 1 (by definition)</li>
                    </ul>
                    <p>
                      <strong>Input:</strong> A non-negative integer n
                    </p>
                    <p>
                      <strong>Output:</strong> The factorial of n
                    </p>
                  </Card.Text>
                </Card.Body>
              </Card>

              <Card className="mb-4 text-center">
                <Card.Header>Time Remaining</Card.Header>
                <Card.Body>
                  <h3
                    className={
                      timeLeft < 300
                        ? "text-danger"
                        : timeLeft < 600
                        ? "text-warning"
                        : "text-primary"
                    }
                  >
                    {formatTime(timeLeft)}
                  </h3>
                  <Button
                    variant="success"
                    onClick={handleSubmitCode}
                    disabled={loading}
                    className="mt-2"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />{" "}
                        Submitting...
                      </>
                    ) : (
                      "Submit Solution"
                    )}
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={8}>
              <Card className="mb-4">
                <Card.Header>Code Editor</Card.Header>
                <Card.Body style={{ padding: 0 }}>
                  <Tabs defaultActiveKey="editor" id="code-tabs">
                    <Tab eventKey="editor" title="Editor">
                      <div
                        style={{ height: "500px", border: "1px solid #ddd" }}
                      >
                        <MonacoEditor
                          width="100%"
                          height="500"
                          language="python"
                          theme="vs-dark"
                          value={code}
                          options={editorOptions}
                          onChange={handleEditorChange}
                        />
                      </div>
                    </Tab>
                    <Tab eventKey="instructions" title="Instructions">
                      <div className="p-3">
                        <h5>Tips for Implementation:</h5>
                        <ul>
                          <li>
                            Consider both recursive and iterative approaches
                          </li>
                          <li>Handle edge cases (0, 1)</li>
                          <li>
                            Consider the time and space complexity of your
                            solution
                          </li>
                          <li>Include appropriate error handling</li>
                        </ul>

                        <h5>Test Cases:</h5>
                        <pre>
                          Input: 5<br />
                          Expected Output: 120
                          <br />
                          <br />
                          Input: 0<br />
                          Expected Output: 1<br />
                          <br />
                          Input: 10
                          <br />
                          Expected Output: 3628800
                        </pre>
                      </div>
                    </Tab>
                  </Tabs>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {error && <Alert variant="danger">{error}</Alert>}
        </>
      )}
    </div>
  );
};

export default CodingAssessment;
