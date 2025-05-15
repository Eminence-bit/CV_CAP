# Candidate Verification and Coding Assessment Platform (CV-CAP)

This proof of concept (PoC) demonstrates a blockchain-based certificate verification system integrated with a coding assessment platform. The system allows for verifying educational credentials using Ethereum smart contracts and assessing coding skills through an interactive online IDE with AI evaluation.

## Project Structure

```
CV-CAP/
├── backend/                 # Flask backend server
│   ├── app.py               # Main application file
│   ├── blockchain_connector.py  # Web3 connector for Ethereum
│   ├── contract_abi.json    # Smart contract ABI
│   └── requirements.txt     # Python dependencies
├── blockchain/              # Ethereum smart contract
│   ├── contracts/
│   │   └── CertificateVerifier.sol  # Solidity smart contract
│   ├── migrations/
│   │   └── 1_deploy_certificate_verifier.js  # Deployment script
│   └── truffle-config.js    # Truffle configuration
└── frontend/               # React frontend
    ├── public/             # Static assets
    └── src/                # React source code
        ├── components/     # React components
        └── services/       # API services
```

## Features

1. **Certificate Verification**
   - Upload certificate documents (PDF, JPEG, PNG)
   - Verify certificates using blockchain (Ethereum smart contracts)
   - Store and retrieve certificate hashes

2. **Coding Assessment**
   - Interactive coding environment for Python tests
   - Real-time test evaluation
   - Code quality analysis using AI (CodeBERT)

3. **Comprehensive Reporting**
   - Detailed test results with pass/fail status
   - Code quality metrics
   - Overall assessment scores

## Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- Truffle Suite
- Ganache (for local blockchain)
- MetaMask (for blockchain interaction)

## Installation

### Blockchain Setup

1. Install Truffle and Ganache:
   ```bash
   npm install -g truffle
   npm install -g ganache-cli
   ```

2. Start local Ethereum blockchain:
   ```bash
   ganache-cli
   ```

3. Compile and deploy smart contract:
   ```bash
   cd blockchain
   truffle compile
   truffle migrate --network development
   ```

### Backend Setup

1. Create a Python virtual environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the Flask server:
   ```bash
   python app.py
   ```

### Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open your browser at http://localhost:3000

## Usage

1. **Certificate Verification**
   - Upload a certificate document or enter details manually
   - System will verify authenticity against blockchain records
   - View verification status and blockchain transaction details

2. **Coding Assessment**
   - Select a coding problem (currently factorial calculation)
   - Implement solution in the integrated IDE
   - Submit for evaluation and scoring

3. **View Results**
   - See detailed test results and code quality metrics
   - Review strengths and areas for improvement
   - Download comprehensive assessment report

## Future Enhancements

- Multiple programming language support
- Advanced plagiarism detection
- Integration with HR systems
- More complex coding challenges
- Expanded certificate verification partnerships

## License

MIT

## Contact

For any questions or inquiries, please contact: info@cv-cap.com
