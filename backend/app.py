from flask import Flask, request, jsonify
from flask_cors import CORS
import hashlib
import json
import os
from werkzeug.utils import secure_filename
import tempfile
import subprocess
from transformers import AutoTokenizer, AutoModel
import torch
import numpy as np

app = Flask(__name__)
CORS(app)

# Configure uploads
UPLOAD_FOLDER = tempfile.mkdtemp()
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload

# Load CodeBERT model
tokenizer = None
model = None

def load_model():
    global tokenizer, model
    tokenizer = AutoTokenizer.from_pretrained("microsoft/codebert-base")
    model = AutoModel.from_pretrained("microsoft/codebert-base")

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def generate_certificate_hash(candidate_name, certificate_id, issuer_name, issue_date):
    """Generate a hash for a certificate to be stored in blockchain"""
    data = candidate_name + certificate_id + issuer_name + str(issue_date)
    return hashlib.sha256(data.encode()).hexdigest()

def evaluate_code(code, test_cases):
    """Evaluate submitted Python code against test cases"""
    # Save code to temp file
    _, temp_path = tempfile.mkstemp(suffix='.py')
    with open(temp_path, 'w') as f:
        f.write(code)
    
    results = []
    for test_case in test_cases:
        try:
            # Run the code with test input
            cmd = f"python {temp_path} {test_case['input']}"
            output = subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT, timeout=5).decode().strip()
            
            # Check if output matches expected
            success = output == test_case['expected']
            results.append({
                'test_case': test_case['input'],
                'expected': test_case['expected'],
                'actual': output,
                'passed': success
            })
        except Exception as e:
            results.append({
                'test_case': test_case['input'],
                'expected': test_case['expected'],
                'actual': str(e),
                'passed': False
            })
    
    # Calculate success percentage
    passed = sum(1 for r in results if r['passed'])
    percentage = (passed / len(test_cases)) * 100
    
    return {
        'results': results,
        'passed': passed,
        'total': len(test_cases),
        'percentage': percentage
    }

def code_quality_analysis(code):
    """Use CodeBERT to analyze code quality"""
    global tokenizer, model
    
    # Ensure model is loaded
    if tokenizer is None or model is None:
        load_model()
    
    # Tokenize code
    inputs = tokenizer(code, return_tensors="pt", truncation=True, max_length=512)
    
    # Get embeddings
    with torch.no_grad():
        outputs = model(**inputs)
    
    # Use the embeddings for simple quality metrics (simplified for PoC)
    embedding = outputs.last_hidden_state.mean(dim=1).numpy()
    
    # Simple metrics based on code length and complexity indicators
    code_lines = len(code.split('\n'))
    comments = code.count('#')
    
    quality_score = min(100, max(0, 50 + np.random.normal(scale=15)))  # Simplified quality scoring
    
    return {
        'quality_score': round(quality_score, 2),
        'code_lines': code_lines,
        'comments': comments
    }

@app.route('/api/verify-certificate', methods=['POST'])
def verify_certificate():
    """Endpoint to verify a certificate (mocked blockchain interaction)"""
    data = request.json
    
    # In a real implementation, this would verify against the actual blockchain
    # For the PoC, we'll mock the verification process
    certificate_hash = generate_certificate_hash(
        data.get('candidateName', ''),
        data.get('certificateId', ''),
        data.get('issuerName', ''),
        data.get('issueDate', 0)
    )
    
    # Simulate blockchain verification (would be real in production)
    is_valid = len(certificate_hash) % 2 == 0  # Just for demo
    
    return jsonify({
        'verified': is_valid,
        'certificateHash': certificate_hash,
        'message': 'Certificate successfully verified' if is_valid else 'Certificate verification failed'
    })

@app.route('/api/upload-certificate', methods=['POST'])
def upload_certificate():
    """Endpoint to upload certificate document"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # In production, this would process the document 
        # and extract information for blockchain verification
        return jsonify({
            'success': True,
            'filename': filename,
            'message': 'Certificate uploaded successfully and pending verification'
        })
    
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/api/submit-coding-test', methods=['POST'])
def submit_coding_test():
    """Endpoint to submit and evaluate a coding test"""
    data = request.json
    code = data.get('code', '')
    problem_type = data.get('problemType', 'factorial')
    
    # Define test cases based on problem type
    if problem_type == 'factorial':
        test_cases = [
            {'input': '5', 'expected': '120'},
            {'input': '0', 'expected': '1'},
            {'input': '10', 'expected': '3628800'}
        ]
    else:
        # Default test cases
        test_cases = [{'input': '5', 'expected': '5'}]
    
    # Evaluate the submitted code
    evaluation_results = evaluate_code(code, test_cases)
    
    # Analyze code quality
    quality_analysis = code_quality_analysis(code)
    
    # Calculate overall score
    correctness_weight = 0.7
    quality_weight = 0.3
    overall_score = (evaluation_results['percentage'] * correctness_weight) + (quality_analysis['quality_score'] * quality_weight)
    
    return jsonify({
        'evaluationResults': evaluation_results,
        'qualityAnalysis': quality_analysis,
        'overallScore': round(overall_score, 2)
    })

if __name__ == '__main__':
    # Load CodeBERT model at startup
    load_model()
    app.run(debug=True, port=5000)
