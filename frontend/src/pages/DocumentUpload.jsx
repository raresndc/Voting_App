import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import documentServiceApi from '../api/documentService';
import { useUser } from '../context/UserContext';

export default function DocumentUpload() {
  const { user } = useUser();
  const userId = user?.id;
  const [step, setStep] = useState(1);
  const [idFile, setIdFile] = useState(null);
  const [idPreview, setIdPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  // Simple toast helper
  const showToast = (type, message) => {
    setToast({ visible: true, type, message });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      showToast('error', 'Please upload a PDF document');
      return;
    }
    setIdFile(file);
    setIdPreview(URL.createObjectURL(file));
  };

  // Step 1: OCR and save face to Redis
  const handleNext = async () => {
    if (step !== 1 || !idFile || !userId) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', idFile);

      // 1) OCR verification
      await documentServiceApi.post('/documents/ocr/text', formData);

      // 2) Extract face and store in Redis
      await documentServiceApi.post(`/id-photo/${userId}`, formData);

      showToast('success', 'ID verified and face stored successfully!');
      setStep(2);
    } catch (err) {
      const msg = err.response?.data?.message || 'Verification failed: please ensure your ID details match.';
      showToast('error', msg);
    } finally {
      setUploading(false);
    }
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
  };

  return (
    <div className="relative flex flex-col items-center p-6 bg-gradient-to-br from-gray-800 to-gray-900 min-h-screen text-white overflow-hidden">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg ${
              toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

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
        {step === 1 ? 'Step 1: Upload ID Document (PDF)' : 'Step 2: (Done)'}
      </motion.h2>

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
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="mb-4"
              disabled={uploading}
            />
            <motion.button
              whileHover={{ scale: idFile && !uploading && userId ? 1.05 : 1 }}
              whileTap={{ scale: idFile && !uploading && userId ? 0.95 : 1 }}
              disabled={!idFile || uploading || !userId}
              onClick={handleNext}
              className={`w-full py-2 rounded text-white ${
                idFile && !uploading && userId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              {uploading ? 'Verifying...' : 'Next'}
            </motion.button>
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <p className="font-medium text-white mb-4">Your ID is verified and face is stored!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="mt-4 w-full py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Back
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
)}
