// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateVerifier {
    address public owner;
    
    // Mapping from certificate hash to its verification status
    mapping(bytes32 => bool) private certificates;
    
    // Mapping to store certificate metadata (issuer, issuance date, etc.)
    mapping(bytes32 => string) private certificateMetadata;
    
    // Events
    event CertificateAdded(bytes32 indexed certificateHash, string metadata);
    event CertificateVerified(bytes32 indexed certificateHash, bool verified);
    
    constructor() {
        owner = msg.sender;
    }
    
    // Only owner can add certificates
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    
    // Add a new certificate to the blockchain
    function addCertificate(bytes32 certificateHash, string memory metadata) public onlyOwner {
        require(certificates[certificateHash] == false, "Certificate already exists");
        
        certificates[certificateHash] = true;
        certificateMetadata[certificateHash] = metadata;
        
        emit CertificateAdded(certificateHash, metadata);
    }
    
    // Verify if a certificate exists
    function verifyCertificate(bytes32 certificateHash) public view returns (bool, string memory) {
        bool exists = certificates[certificateHash];
        string memory metadata = certificateMetadata[certificateHash];
        
        return (exists, metadata);
    }
    
    // Generate a hash from certificate data
    function generateCertificateHash(
        string memory candidateName, 
        string memory certificateId, 
        string memory issuerName,
        uint256 issueDate
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(candidateName, certificateId, issuerName, issueDate));
    }
}
