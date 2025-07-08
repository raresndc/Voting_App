import React, { useState } from 'react';
import axios from 'axios';

export default function DocumentUpload({ userId }) {
  const [step, setStep] = useState(1);
  const [idFile, setIdFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [idPreview, setIdPreview] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (type === 'id') {
      // Only accept PDF for ID step
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF document');
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setIdFile(file);
      setIdPreview(previewUrl);
    } else {
      // Only accept JPG/PNG for selfie step
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        alert('Please upload a JPG or PNG image');
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setSelfieFile(file);
      setSelfiePreview(previewUrl);
    }
  };

  const handleNext = () => {
    if (step === 1 && idFile) setStep(2);
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
  };

  const handleUpload = async () => {
    if (!idFile || !selfieFile) return;
    setUploading(true);
    try {
      // Upload ID PDF
      const formData1 = new FormData();
      formData1.append('file', idFile);
      await axios.post(`/api/id-photo/${userId}`, formData1);
      // Upload selfie image
      const formData2 = new FormData();
      formData2.append('file', selfieFile);
      await axios.post(`/api/face-photo/${userId}`, formData2);
      alert('Files uploaded successfully!');
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 text-gray-900">
      <h2 className="text-center text-2xl font-semibold mb-4">
        {step === 1
          ? 'Step 1: Upload ID Document (PDF only)'
          : 'Step 2: Upload Selfie (JPG/PNG)'}
      </h2>
      <div className="flex flex-col items-center">
        {step === 1 && (
          <>
            {idPreview ? (
              <object
                data={idPreview}
                type="application/pdf"
                width="200"
                height="260"
                className="mb-4 border rounded"
              >
                <p className="text-sm text-gray-500">PDF preview not available.</p>
              </object>
            ) : (
              <div className="mb-4 p-6 border-2 border-dashed border-gray-300 rounded text-gray-500 flex flex-col items-center">
                <p className="font-medium mb-2">Choose your ID document</p>
                <img src="/images/upload.png" alt="upload" className="mb-4 w-24 h-24 object-cover" />
                <p className="mt-1 text-sm">PDF only</p>
              </div>
            )}
            <input
              type="file"
              accept="application/pdf"
              onChange={e => handleFileChange(e, 'id')}
              className="mb-4"
            />
            <button
              onClick={handleNext}
              disabled={!idFile}
              className={`px-4 py-2 rounded ${
                idFile
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </>
        )}

        {step === 2 && (
          <>
            {selfiePreview ? (
              <img
                src={selfiePreview}
                alt="Selfie preview"
                className="mb-4 w-48 h-48 object-cover rounded-full"
              />
            ) : (
              <div className="mb-4 p-6 border-2 border-dashed border-gray-300 rounded text-gray-500 flex flex-col items-center">
                <p className="font-medium mb-2">Choose your selfie</p>
                <img src="/images/selfie.jpg" alt="upload" className="mb-4 w-24 h-24 object-cover" />
                <p className="mt-1 text-sm">JPG/PNG only</p>
              </div>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={e => handleFileChange(e, 'selfie')}
              className="mb-4"
            />
            <div className="flex space-x-4">
              <button
                onClick={handleBack}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Back
              </button>
              <button
                onClick={handleUpload}
                disabled={!selfieFile || uploading}
                className={`px-4 py-2 rounded ${
                  selfieFile
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
              >
                {uploading ? 'Uploading...' : 'Upload & Verify'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
