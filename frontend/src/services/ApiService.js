import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const ApiService = {
  // Certificate verification endpoints
  verifyCertificate: (certificateData) => {
    return axios.post(`${API_URL}/verify-certificate`, certificateData);
  },

  uploadCertificate: (formData) => {
    return axios.post(`${API_URL}/upload-certificate`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Coding test endpoints
  submitCodingTest: (testData) => {
    return axios.post(`${API_URL}/submit-coding-test`, testData);
  },

  // Blockchain interaction endpoints (would be implemented in production)
  getBlockchainTransaction: (txHash) => {
    return axios.get(`${API_URL}/blockchain/transaction/${txHash}`);
  },
};

export default ApiService;
