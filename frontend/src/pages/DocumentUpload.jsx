// src/pages/DocumentUpload.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function DocumentUpload({ userId }) {
  const [step, setStep] = useState(1);
  const [idFile, setIdFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [idPreview, setIdPreview] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (type === 'id') {
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF document');
        return;
      }
      setIdFile(file);
      setIdPreview(URL.createObjectURL(file));
    } else {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError('Please upload a JPG or PNG image');
        return;
      }
      setSelfieFile(file);
      setSelfiePreview(URL.createObjectURL(file));
    }
  };

  const handleNext = () => step === 1 && idFile && setStep(2);
  const handleBack = () => step === 2 && setStep(1);

  const handleUpload = async () => {
    if (!idFile || !selfieFile) return;
    setUploading(true);
    setError('');
    try {
      const formData1 = new FormData();
      formData1.append('file', idFile);
      await axios.post(`/api/id-photo/${userId}`, formData1);

      const formData2 = new FormData();
      formData2.append('file', selfieFile);
      await axios.post(`/api/face-photo/${userId}`, formData2);

      setSuccess('Files uploaded and verified successfully!');
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center p-6 bg-gradient-to-br from-gray-800 to-gray-900 min-h-screen text-white overflow-hidden">
      {/* Background Animations */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 4 }}
        className="absolute w-96 h-96 bg-white bg-opacity-10 rounded-full top-16 left-8"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 0.8 }}
        transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 3 }}
        className="absolute w-80 h-80 bg-white bg-opacity-5 rounded-full bottom-16 right-8"
      />

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-3xl font-extrabold mb-6"
      >
        {step === 1 ? 'Step 1: Upload ID Document (PDF)' : 'Step 2: Upload Selfie'}
      </motion.h2>

      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 mb-4 z-10">
          {error}
        </motion.p>
      )}
      {success && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 mb-4 z-10">
          {success}
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative z-10 bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-xl shadow-xl w-full max-w-md"
      >
        {step === 1 && (
          <div className="flex flex-col items-center">
            {idPreview ? (
              <object data={idPreview} type="application/pdf" className="w-full h-64 mb-4 rounded">
                PDF preview not available.
              </object>
            ) : (
              <div className="mb-4 p-6 border-2 border-dashed border-white rounded text-center">
                <p className="font-medium mb-2">Choose your ID PDF</p>
              </div>
            )}
            <input type="file" accept="application/pdf" onChange={e => handleFileChange(e, 'id')} className="mb-4" />
            <motion.button
              whileHover={{ scale: idFile ? 1.05 : 1 }}
              whileTap={{ scale: idFile ? 0.95 : 1 }}
              disabled={!idFile}
              onClick={handleNext}
              className={`w-full py-2 rounded ${idFile ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 cursor-not-allowed'} text-white`}
            >
              Next
            </motion.button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center">
            {selfiePreview ? (
              <img src={selfiePreview} alt="Selfie preview" className="w-48 h-48 mb-4 rounded-full object-cover" />
            ) : (
              <div className="mb-4 p-6 border-2 border-dashed border-white rounded text-center">
                <p className="font-medium mb-2">Choose your selfie (JPG/PNG)</p>
              </div>
            )}
            <input type="file" accept="image/jpeg,image/png" onChange={e => handleFileChange(e, 'selfie')} className="mb-4" />
            <div className="flex w-full gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBack}
                className="flex-1 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Back
              </motion.button>
              <motion.button
                whileHover={{ scale: selfieFile ? 1.05 : 1 }}
                whileTap={{ scale: selfieFile ? 0.95 : 1 }}
                onClick={handleUpload}
                disabled={!selfieFile || uploading}
                className={`flex-1 py-2 rounded text-white ${selfieFile ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 cursor-not-allowed'}`}
              >
                {uploading ? 'Uploading...' : 'Upload & Verify'}
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
