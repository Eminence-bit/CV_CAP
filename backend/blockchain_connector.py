import json
import os
from web3 import Web3
from eth_account import Account
from web3.middleware import geth_poa_middleware

class BlockchainConnector:
    def __init__(self, infura_url=None, contract_address=None, private_key=None):
        # Connect to Ethereum network (default to local Ganache for development)
        self.web3 = Web3(Web3.HTTPProvider(infura_url or 'http://127.0.0.1:8545'))
        
        # Add PoA middleware for networks like Rinkeby
        self.web3.middleware_onion.inject(geth_poa_middleware, layer=0)
        
        # Load contract ABI
        dir_path = os.path.dirname(os.path.realpath(__file__))
        with open(os.path.join(dir_path, 'contract_abi.json'), 'r') as f:
            contract_abi = json.load(f)
            
        # Set contract and account
        self.contract_address = contract_address or os.environ.get('CONTRACT_ADDRESS')
        self.contract = self.web3.eth.contract(address=self.contract_address, abi=contract_abi)
        self.account = self.web3.eth.account.from_key(private_key or os.environ.get('PRIVATE_KEY'))
        
    def add_certificate(self, certificate_hash, metadata):
        """Add a certificate to the blockchain"""
        try:
            # Build transaction
            nonce = self.web3.eth.get_transaction_count(self.account.address)
            tx = self.contract.functions.addCertificate(certificate_hash, metadata).build_transaction({
                'from': self.account.address,
                'nonce': nonce,
                'gas': 2000000,
                'gasPrice': self.web3.to_wei('50', 'gwei')
            })
            
            # Sign and send transaction
            signed_tx = self.web3.eth.account.sign_transaction(tx, self.account.key)
            tx_hash = self.web3.eth.send_raw_transaction(signed_tx.rawTransaction)
            receipt = self.web3.eth.wait_for_transaction_receipt(tx_hash)
            
            return {
                'success': True,
                'txHash': tx_hash.hex(),
                'blockNumber': receipt.blockNumber
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def verify_certificate(self, certificate_hash):
        """Verify a certificate on the blockchain"""
        try:
            exists, metadata = self.contract.functions.verifyCertificate(certificate_hash).call()
            return {
                'exists': exists,
                'metadata': metadata
            }
        except Exception as e:
            return {
                'exists': False,
                'error': str(e)
            }
    
    def generate_certificate_hash(self, candidate_name, certificate_id, issuer_name, issue_date):
        """Generate a hash for a certificate using the smart contract's function"""
        try:
            # Convert issue_date to integer if it's not already
            if isinstance(issue_date, str):
                issue_date = int(issue_date)
                
            cert_hash = self.contract.functions.generateCertificateHash(
                candidate_name,
                certificate_id,
                issuer_name,
                issue_date
            ).call()
            
            return {
                'success': True,
                'certificateHash': cert_hash
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
