// client/src/components/ResumeUploader.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

const ResumeUploader = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [inputKey, setInputKey] = useState(Date.now());

  const handleFileChange = (e) => {
    // We only accept PDF for this example
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
      setError('');
    } else {
      setResumeFile(null);
      setError('Please upload a valid PDF file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile || !jobDescription) {
      setError('Please upload a resume and provide a job description.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await axios.post('http://localhost:5050/api/resume/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob', // Important to handle the PDF file response
      });

      // Use file-saver to trigger the download
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      saveAs(pdfBlob, 'revised-resume.pdf');
      setSuccessMessage('Success! Your revised resume has been downloaded.');
      setJobDescription('');
      setResumeFile(null);
      setInputKey(Date.now());

    } catch (err) {
      setIsLoading(false); // Stop the spinner on error
      console.error('Upload failed:', err);
      if (err.response && err.response.data.toString() === '[object Blob]') {
        const errText = await err.response.data.text();
        try {
          const errJson = JSON.parse(errText);
          setError(errJson.error || 'An unexpected error occurred.');
        } catch (parseError) {
          setError('An unexpected error occurred and the error message could not be parsed.');
        }
      } else {
         setError('An unexpected server error occurred.');
      }
    }
      
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="job-description" className="block text-sm font-medium text-gray-700">
          Job Description
        </label>
        <div className="mt-1">
          <textarea
            id="job-description"
            name="job-description"
            rows={8}
            className="block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Upload Resume (PDF only)
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                <span>Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf" key={inputKey} />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PDF up to 10MB</p>
            {resumeFile && <p className="text-sm text-green-600 mt-2">{resumeFile.name}</p>}
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 text-center">{error}</p>}
      <div className="text-center h-5">
            {error && <p className="text-sm text-red-600">{error}</p>}
            {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}
        </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing... This may take a moment.
            </div>
          ) : 'Analyze and Revise My Resume'}
        </button>
      </div>
    </form>
  );
};

export default ResumeUploader;