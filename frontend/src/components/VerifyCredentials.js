import React, { useState } from "react";
import { Form, Button, Card, Alert, Spinner, Row, Col } from "react-bootstrap";
import axios from "axios";

const VerifyCredentials = () => {
  const [formData, setFormData] = useState({
    candidateName: "",
    certificateId: "",
    issuerName: "",
    issueDate: "",
  });

  const [file, setFile] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleManualVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/verify-certificate", formData);
      setVerificationResult(response.data);
    } catch (err) {
      setError(
        "Error verifying certificate: " +
          (err.response?.data?.message || err.message)
      );
    }

    setLoading(false);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/upload-certificate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Normally this would trigger a real verification
      // For the PoC, we'll simulate a successful response
      setTimeout(() => {
        setVerificationResult({
          verified: true,
          certificateHash: "0x" + Math.random().toString(16).substr(2, 64),
          message: "Certificate successfully verified",
        });
        setLoading(false);
      }, 2000);
    } catch (err) {
      setError(
        "Error uploading certificate: " +
          (err.response?.data?.message || err.message)
      );
      setLoading(false);
    }
  };

  return (
    <div className="verify-credentials-page">
      <h2 className="mb-4">Credential Verification</h2>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>Manual Verification</Card.Header>
            <Card.Body>
              <Form onSubmit={handleManualVerify}>
                <Form.Group className="mb-3">
                  <Form.Label>Candidate Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="candidateName"
                    value={formData.candidateName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Certificate ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="certificateId"
                    value={formData.certificateId}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Issuer Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="issuerName"
                    value={formData.issuerName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Issue Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />{" "}
                      Verifying...
                    </>
                  ) : (
                    "Verify Certificate"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>Upload Certificate</Card.Header>
            <Card.Body>
              <Form onSubmit={handleFileUpload}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    Upload Certificate Document (PDF, JPG, PNG)
                  </Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                  />
                  <Form.Text className="text-muted">
                    We'll extract information from the document and verify
                    against blockchain records.
                  </Form.Text>
                </Form.Group>

                <Button
                  variant="success"
                  type="submit"
                  disabled={loading || !file}
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
                      Processing...
                    </>
                  ) : (
                    "Upload & Verify"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {verificationResult && (
        <Card
          className={`mb-4 ${
            verificationResult.verified ? "border-success" : "border-danger"
          }`}
        >
          <Card.Header
            as="h5"
            className={
              verificationResult.verified
                ? "bg-success text-white"
                : "bg-danger text-white"
            }
          >
            Verification Result
          </Card.Header>
          <Card.Body>
            <Card.Title>
              {verificationResult.verified
                ? "Certificate Verified"
                : "Certificate Not Verified"}
            </Card.Title>
            <Card.Text>{verificationResult.message}</Card.Text>

            <div className="mt-3">
              <strong>Certificate Hash:</strong>{" "}
              {verificationResult.certificateHash}
            </div>

            {verificationResult.verified && (
              <div className="mt-3">
                <Button variant="outline-primary" size="sm">
                  View Certificate Details
                </Button>{" "}
                <Button variant="outline-secondary" size="sm">
                  View Blockchain Transaction
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default VerifyCredentials;
