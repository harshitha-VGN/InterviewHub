import React, { useState } from 'react';

function ResumeUploader() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setStatus('');
        setAnalysisResult(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedFile) {
            setStatus('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('resume', selectedFile);

        setIsLoading(true);
        setStatus('Uploading and analyzing... This may take a moment.');

        try {
            // This URL must match your backend server's address and port
            const response = await fetch('http://localhost:5050/api/analyze-resume', {
                method: 'POST',
                body: formData,
            });
            
            const data = await response.json();

            if (!response.ok) {
                // Handle errors from the server (e.g., "No file uploaded")
                throw new Error(data.error || 'An unknown server error occurred.');
            }

            setAnalysisResult(data);
            setStatus('Analysis Complete!');

        } catch (error) {
            console.error('Upload Error:', error);
            setStatus(`Error: ${error.message}`);
            setAnalysisResult(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Resume Analyzer</h1>
            <p>Upload your PDF resume to get AI-powered feedback.</p>
            <form onSubmit={handleSubmit}>
                <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={handleFileChange} 
                    disabled={isLoading}
                />
                <button type="submit" disabled={!selectedFile || isLoading}>
                    {isLoading ? 'Analyzing...' : 'Analyze Resume'}
                </button>
            </form>

            {status && <p style={{ fontStyle: 'italic' }}>{status}</p>}

            {analysisResult && (
                <div>
                    <h2>Analysis Results</h2>
                    <pre style={{ backgroundColor: '#f4f4f4', padding: '15px', borderRadius: '5px', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                        {JSON.stringify(analysisResult, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}

export default ResumeUploader;