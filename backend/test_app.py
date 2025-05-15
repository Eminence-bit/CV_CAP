import unittest
import json
import os
import tempfile
from app import app

class FlaskAppTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        
    def test_verify_certificate(self):
        """Test certificate verification endpoint"""
        test_data = {
            'candidateName': 'John Doe',
            'certificateId': 'CS-2025-001',
            'issuerName': 'University of Technology',
            'issueDate': '1621036800'
        }
        
        response = self.app.post('/api/verify-certificate',
                                data=json.dumps(test_data),
                                content_type='application/json')
        
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue('verified' in data)
        self.assertTrue('certificateHash' in data)
        self.assertTrue('message' in data)
        
    def test_submit_coding_test(self):
        """Test coding test submission endpoint"""
        test_code = """
def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n-1)

if __name__ == "__main__":
    import sys
    n = int(sys.argv[1])
    result = factorial(n)
    print(result)
        """
        
        test_data = {
            'code': test_code,
            'problemType': 'factorial'
        }
        
        response = self.app.post('/api/submit-coding-test',
                                data=json.dumps(test_data),
                                content_type='application/json')
        
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue('evaluationResults' in data)
        self.assertTrue('qualityAnalysis' in data)
        self.assertTrue('overallScore' in data)
        
    def test_upload_certificate(self):
        """Test certificate upload endpoint"""
        # Create temp file
        with tempfile.NamedTemporaryFile(suffix='.pdf') as temp:
            temp.write(b'Dummy PDF content')
            temp.flush()
            
            # Test file upload
            response = self.app.post('/api/upload-certificate',
                                   data={'file': (open(temp.name, 'rb'), 'test.pdf')},
                                   content_type='multipart/form-data')
            
            data = json.loads(response.data)
            self.assertEqual(response.status_code, 200)
            self.assertTrue(data['success'])
            self.assertTrue('filename' in data)
            self.assertTrue('message' in data)

if __name__ == '__main__':
    unittest.main()
