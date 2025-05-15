import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Table,
  ProgressBar,
  Badge,
} from "react-bootstrap";

const Results = () => {
  const [codingResults, setCodingResults] = useState(null);
  const [certificateResult, setCertificateResult] = useState(null);

  useEffect(() => {
    // Get stored results from session storage
    const storedCodingResults = sessionStorage.getItem("codingResults");
    const storedCertificateResult = sessionStorage.getItem("certificateResult");

    if (storedCodingResults) {
      setCodingResults(JSON.parse(storedCodingResults));
    } else {
      // Set sample data for demonstration
      setCodingResults({
        evaluationResults: {
          results: [
            { test_case: "5", expected: "120", actual: "120", passed: true },
            { test_case: "0", expected: "1", actual: "1", passed: true },
            {
              test_case: "10",
              expected: "3628800",
              actual: "3628800",
              passed: true,
            },
          ],
          passed: 3,
          total: 3,
          percentage: 100,
        },
        qualityAnalysis: {
          quality_score: 85.7,
          code_lines: 12,
          comments: 3,
        },
        overallScore: 95.7,
      });
    }

    if (storedCertificateResult) {
      setCertificateResult(JSON.parse(storedCertificateResult));
    } else {
      // Set sample data for demonstration
      setCertificateResult({
        verified: true,
        certificateHash:
          "0x7a9fe22d31aff27eb5d7ef8e8fca0fccaf9c584e3a4fe9eccc358e97c581c342",
        message: "Certificate successfully verified",
      });
    }
  }, []);

  const getScoreVariant = (score) => {
    if (score >= 90) return "success";
    if (score >= 70) return "info";
    if (score >= 50) return "warning";
    return "danger";
  };

  const downloadReport = () => {
    // In a real implementation, this would generate and download a PDF report
    alert(
      "This feature would generate a downloadable report in a production environment."
    );
  };

  return (
    <div className="results-page">
      <h2 className="mb-4">Assessment Results</h2>

      <Row className="mb-4">
        <Col>
          <Card className="text-center">
            <Card.Header as="h5">Overall Assessment</Card.Header>
            <Card.Body>
              <Row>
                <Col md={4} className="border-end">
                  <h2>95.7%</h2>
                  <p>Overall Score</p>
                  <Badge bg={getScoreVariant(95.7)} className="fs-6 px-3 py-2">
                    Excellent
                  </Badge>
                </Col>
                <Col md={8} className="text-start">
                  <p>
                    <strong>Candidate Name:</strong> John Doe (demo)
                  </p>
                  <p>
                    <strong>Assessment Date:</strong> May 15, 2025
                  </p>
                  <p>
                    <strong>Assessment ID:</strong> CV-CAP-20250515-001
                  </p>
                  <Button
                    variant="primary"
                    className="mt-2"
                    onClick={downloadReport}
                  >
                    Download Full Report
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h3 className="mb-3">Credential Verification</h3>
      {certificateResult && (
        <Card
          className={`mb-4 ${
            certificateResult.verified ? "border-success" : "border-danger"
          }`}
        >
          <Card.Header
            className={
              certificateResult.verified
                ? "bg-success text-white"
                : "bg-danger text-white"
            }
          >
            Verification Status
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={4}>
                <h4>
                  {certificateResult.verified ? (
                    <>✅ Verified</>
                  ) : (
                    <>❌ Not Verified</>
                  )}
                </h4>
              </Col>
              <Col md={8}>
                <p>
                  <strong>Certificate Hash:</strong>
                </p>
                <p className="text-muted">
                  {certificateResult.certificateHash}
                </p>
                <p>
                  <strong>Details:</strong> {certificateResult.message}
                </p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      <h3 className="mb-3">Coding Assessment</h3>
      {codingResults && (
        <>
          <Row>
            <Col md={4}>
              <Card className="mb-4">
                <Card.Header>Test Results</Card.Header>
                <Card.Body>
                  <h1 className="display-4 text-center mb-4">
                    {codingResults.evaluationResults.percentage}%
                  </h1>
                  <ProgressBar
                    variant={getScoreVariant(
                      codingResults.evaluationResults.percentage
                    )}
                    now={codingResults.evaluationResults.percentage}
                    className="mb-3"
                  />
                  <p className="text-center">
                    <strong>{codingResults.evaluationResults.passed}</strong> of{" "}
                    {codingResults.evaluationResults.total} tests passed
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="mb-4">
                <Card.Header>Code Quality</Card.Header>
                <Card.Body>
                  <h1 className="display-4 text-center mb-4">
                    {codingResults.qualityAnalysis.quality_score}%
                  </h1>
                  <ProgressBar
                    variant={getScoreVariant(
                      codingResults.qualityAnalysis.quality_score
                    )}
                    now={codingResults.qualityAnalysis.quality_score}
                    className="mb-3"
                  />
                  <Row className="text-center">
                    <Col>
                      <p>
                        <strong>
                          {codingResults.qualityAnalysis.code_lines}
                        </strong>
                      </p>
                      <p className="text-muted">Lines of Code</p>
                    </Col>
                    <Col>
                      <p>
                        <strong>
                          {codingResults.qualityAnalysis.comments}
                        </strong>
                      </p>
                      <p className="text-muted">Comments</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="mb-4">
                <Card.Header>Overall Coding Score</Card.Header>
                <Card.Body>
                  <h1 className="display-4 text-center mb-4">
                    {codingResults.overallScore}%
                  </h1>
                  <ProgressBar
                    variant={getScoreVariant(codingResults.overallScore)}
                    now={codingResults.overallScore}
                    className="mb-3"
                  />
                  <p className="text-center">
                    <Badge
                      bg={getScoreVariant(codingResults.overallScore)}
                      className="fs-6 px-3 py-2"
                    >
                      {codingResults.overallScore >= 90
                        ? "Excellent"
                        : codingResults.overallScore >= 70
                        ? "Good"
                        : codingResults.overallScore >= 50
                        ? "Average"
                        : "Needs Improvement"}
                    </Badge>
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="mb-4">
            <Card.Header>Test Case Details</Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Input</th>
                    <th>Expected Output</th>
                    <th>Actual Output</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {codingResults.evaluationResults.results.map(
                    (result, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{result.test_case}</td>
                        <td>{result.expected}</td>
                        <td>{result.actual}</td>
                        <td>
                          {result.passed ? (
                            <Badge bg="success">Passed</Badge>
                          ) : (
                            <Badge bg="danger">Failed</Badge>
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>Recommendations</Card.Header>
            <Card.Body>
              <h5>Strengths:</h5>
              <ul>
                <li>All test cases passed successfully</li>
                <li>Good code organization</li>
                <li>Appropriate variable naming</li>
              </ul>

              <h5>Areas for Improvement:</h5>
              <ul>
                <li>Could add more comments to explain complex logic</li>
                <li>Consider optimizing for larger inputs</li>
                <li>Add more error handling for edge cases</li>
              </ul>

              <h5>Overall Assessment:</h5>
              <p>
                The candidate has demonstrated strong programming skills in
                Python, with excellent problem-solving abilities. The solution
                was correct, efficient, and well-structured. The candidate would
                likely perform well in a software development role.
              </p>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default Results;
