import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import documentServiceApi from '../api/documentService';
import { useUser } from '../context/UserContext';

export default function DocumentUpload() {
  const { user } = useUser();
  const userId = user?.id;
  const [step, setStep] = useState(1);
  const [idFile, setIdFile] = useState(null);
  const [idPreview, setIdPreview] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const showToast = (type, message) => {
    setToast({ visible: true, type, message });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (type === 'id') {
      if (file.type !== 'application/pdf') {
        showToast('error', 'Please upload a PDF document');
        return;
      }
      setIdFile(file);
      setIdPreview(URL.createObjectURL(file));
    } else {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        showToast('error', 'Please upload a JPG or PNG image');
        return;
      }
      setSelfieFile(file);
      setSelfiePreview(URL.createObjectURL(file));
    }
  };

  // Step 1: OCR & cache ID face
  const handleNext = async () => {
    if (step !== 1 || !idFile || !userId) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', idFile);
      await documentServiceApi.post('/documents/ocr/text', fd);
      await documentServiceApi.post(`/id-photo/${userId}`, fd);
      // advance step before showing toast so UI updates immediately
      setStep(2);
      showToast('success', 'ID verified & face extracted successfully!');
      // clear ID preview to focus on selfie step
      setIdPreview(null);
      setIdFile(null);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'ID verification failed.');
    } finally {
      setUploading(false);
    }
  };

  // Step 2: Selfie upload & face comparison
  const handleSelfieUpload = async () => {
    if (step !== 2 || !selfieFile || !userId) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', selfieFile);
      const base = import.meta.env.VITE_BACKEND_IDENTITY_API_BASE || 'http://localhost:8082/api';
      // 1) upload selfie to cache
      await axios.post(
        `${base}/face-photo/${userId}`,
        fd,
        { withCredentials: true }
      );
      // 2) compare against cached face
      const resp = await axios.get(
        `${base}/face-compare/${userId}`,
        {
          withCredentials: true,
          params: { threshold: 96 }
        }
      );
      const result = resp.data;
      if (result.match) {
        setStep(3);
        showToast('success', 'Face verified successfully!');
      } else {
        showToast('error', 'Face verification failed. Please try again.');
      }
    } catch (err) {
      showToast('error', 'Selfie upload or verification failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="relative flex flex-col items-center p-6 bg-gradient-to-br from-gray-800 to-gray-900 min-h-screen text-white overflow-hidden">
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-3xl font-extrabold mb-6"
      >
        {step === 1 && 'Step 1: Upload ID Document (PDF)'}
        {step === 2 && 'Step 2: Upload Selfie'}
        {step === 3 && 'Verification Complete'}
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative z-10 bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-xl shadow-xl w-full max-w-md"
      >
        {step === 1 && (
          <div className="flex flex-col items-center">
            {!idPreview && <div className="mb-4 p-6 border-2 border-dashed border-white rounded text-center"><p className="font-medium mb-2">Choose your ID PDF</p></div>}
            {idPreview && <object data={idPreview} type="application/pdf" className="w-full h-64 mb-4 rounded">PDF preview not available.</object>}
            <input type="file" accept="application/pdf" onChange={e => handleFileChange(e, 'id')} className="mb-4" disabled={uploading} />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!idFile || uploading}
              onClick={handleNext}
              className={`w-full py-2 rounded text-white ${idFile && !uploading ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 cursor-not-allowed'}`}
            >
              {uploading ? 'Verifying...' : 'Next'}
            </motion.button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center">
            {!selfiePreview && <div className="mb-4 p-6 border-2 border-dashed border-white rounded text-center"><p className="font-medium mb-2">Choose your selfie (JPG/PNG)</p></div>}
            {selfiePreview && <img src={selfiePreview} alt="Selfie preview" className="w-48 h-48 mb-4 rounded-full object-cover" />}
            <input type="file" accept="image/jpeg,image/png" onChange={e => handleFileChange(e, 'selfie')} className="mb-4" disabled={uploading} />
            <div className="flex w-full gap-4">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleBack} className="flex-1 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300" disabled={uploading}>Back</motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSelfieUpload}
                disabled={!selfieFile || uploading}
                className={`flex-1 py-2 rounded text-white ${selfieFile && !uploading ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 cursor-not-allowed'}`}
              >
                {uploading ? 'Verifying...' : 'Upload & Verify'}
              </motion.button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <p className="font-medium text-white mb-4">All steps completed successfully!</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setStep(1)} className="mt-4 w-full py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Restart</motion.button>
          </div>
        )}
      </motion.div>
    </div>
)}
