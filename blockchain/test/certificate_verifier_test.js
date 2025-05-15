const CertificateVerifier = artifacts.require("CertificateVerifier");

contract("CertificateVerifier", (accounts) => {
  const owner = accounts[0];
  const nonOwner = accounts[1];

  let verifier;

  beforeEach(async () => {
    verifier = await CertificateVerifier.new({ from: owner });
  });

  it("should set the deployer as the owner", async () => {
    const contractOwner = await verifier.owner();
    assert.equal(contractOwner, owner, "Owner is not set correctly");
  });

  it("should allow the owner to add a certificate", async () => {
    const certificateHash = web3.utils.sha3("test-certificate");
    const metadata = JSON.stringify({
      candidateName: "John Doe",
      certificateId: "12345",
      issuerName: "University of Technology",
      issueDate: "2025-05-15",
    });

    const tx = await verifier.addCertificate(certificateHash, metadata, {
      from: owner,
    });

    // Check if the event was emitted
    assert.equal(
      tx.logs[0].event,
      "CertificateAdded",
      "CertificateAdded event not emitted"
    );
    assert.equal(
      tx.logs[0].args.certificateHash,
      certificateHash,
      "Certificate hash mismatch"
    );

    // Verify the certificate exists
    const result = await verifier.verifyCertificate(certificateHash);
    assert.isTrue(result[0], "Certificate should exist");
    assert.equal(result[1], metadata, "Certificate metadata mismatch");
  });

  it("should not allow non-owners to add a certificate", async () => {
    const certificateHash = web3.utils.sha3("test-certificate-2");
    const metadata = "test metadata";

    try {
      await verifier.addCertificate(certificateHash, metadata, {
        from: nonOwner,
      });
      assert.fail("Non-owner was able to add a certificate");
    } catch (error) {
      assert.include(
        error.message,
        "Only owner can perform this action",
        "Incorrect error message"
      );
    }
  });

  it("should generate consistent certificate hashes", async () => {
    const candidateName = "Jane Smith";
    const certificateId = "CS-2025-001";
    const issuerName = "Tech Institute";
    const issueDate = 1621036800; // May 15, 2021 in unix timestamp

    const hash1 = await verifier.generateCertificateHash(
      candidateName,
      certificateId,
      issuerName,
      issueDate
    );

    const hash2 = await verifier.generateCertificateHash(
      candidateName,
      certificateId,
      issuerName,
      issueDate
    );

    assert.equal(hash1, hash2, "Hash generation is not consistent");
  });
});
