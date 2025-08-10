// client/src/pages/ResumeAnalyzerPage.jsx

import React from 'react';
import ResumeUploader from './ResumeUploader';

const ResumeAnalyzerPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            AI Resume Analyzer
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Upload your resume and the job description to get an ATS-friendly, revised version.
          </p>
        </div>
        <div className="mt-12 bg-white p-8 rounded-xl shadow-lg">
          <ResumeUploader />
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzerPage;