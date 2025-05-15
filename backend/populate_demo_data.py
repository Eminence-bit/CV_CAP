#!/usr/bin/env python3
"""
Demo script to populate the blockchain with sample certificates
"""

import os
import json
import time
import hashlib
from web3 import Web3
import dotenv

# Load environment variables
dotenv.load_dotenv()

# Connect to the local Ethereum blockchain (Ganache)
w3 = Web3(Web3.HTTPProvider('http://localhost:8545'))

# Contract information
CONTRACT_ADDRESS = os.getenv('CONTRACT_ADDRESS')
if not CONTRACT_ADDRESS or CONTRACT_ADDRESS == 'your_contract_address_after_deployment':
    print("Error: CONTRACT_ADDRESS not set in .env file")
    print("Please deploy the contract first using 'truffle migrate' and update the .env file")
    exit(1)

# Load contract ABI
with open('contract_abi.json', 'r') as f:
    CONTRACT_ABI = json.load(f)

# Connect to the contract
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)

# Get the first account (owner account that deployed the contract)
owner_account = w3.eth.accounts[0]

# Sample certificate data
certificates = [
    {
        "candidateName": "John Doe",
        "certificateId": "CS-2025-001",
        "issuerName": "University of Technology",
        "issueDate": int(time.time()),
        "metadata": {
            "degree": "Bachelor of Computer Science",
            "graduationDate": "2025-05-15",
            "GPA": "3.85/4.0"
        }
    },
    {
        "candidateName": "Jane Smith",
        "certificateId": "DS-2025-042",
        "issuerName": "Data Science Academy",
        "issueDate": int(time.time()) - 2592000,  # 30 days ago
        "metadata": {
            "certificate": "Advanced Data Science",
            "completionDate": "2025-04-15",
            "score": "96%"
        }
    },
    {
        "candidateName": "Alex Johnson",
        "certificateId": "WD-2024-103",
        "issuerName": "Web Development Institute",
        "issueDate": int(time.time()) - 7776000,  # 90 days ago
        "metadata": {
            "certificate": "Full Stack Web Development",
            "completionDate": "2025-02-15",
            "projects": 5
        }
    }
]

print("Populating blockchain with sample certificates...")

# Add certificates to the blockchain
for cert in certificates:
    # Generate certificate hash using contract's function
    cert_hash = contract.functions.generateCertificateHash(
        cert["candidateName"],
        cert["certificateId"],
        cert["issuerName"],
        cert["issueDate"]
    ).call()
    
    # Prepare metadata as JSON string
    metadata = json.dumps(cert["metadata"])
    
    # Add certificate to blockchain
    tx_hash = contract.functions.addCertificate(
        cert_hash,
        metadata
    ).transact({'from': owner_account})
    
    # Wait for transaction to be mined
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    
    print(f"Certificate for {cert['candidateName']} added to blockchain")
    print(f"  Transaction Hash: {tx_hash.hex()}")
    print(f"  Block Number: {tx_receipt['blockNumber']}")
    print(f"  Certificate Hash: {cert_hash.hex()}")
    print()

print("Done! Sample certificates have been added to the blockchain.")
print("You can now verify these certificates using the web application.")
