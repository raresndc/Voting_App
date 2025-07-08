import React, { useState } from 'react';
import axios from 'axios';

export default function DocumentUpload() {
  const [idFile, setIdFile] = useState(null);
  const [selfie, setSelfie] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    if (idFile) {
      formData.append('file', idFile);
      await axios.post(`/api/id-photo/${userId}`, formData);
    }
    if (selfie) {
      formData.set('file', selfie);
      await axios.post(`/api/face-photo/${userId}`, formData);
    }
    // optionally poll verification status
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Document Upload</h1>
      <div className="space-y-4">
        <div>
          <label className="block mb-1">ID Document</label>
          <input type="file" accept="image/*" onChange={e => setIdFile(e.target.files[0])} />
        </div>
        <div>
          <label className="block mb-1">Selfie</label>
          <input type="file" accept="image/*" onChange={e => setSelfie(e.target.files[0])} />
        </div>
        <button onClick={handleUpload} className="px-4 py-2 bg-blue-600 text-white rounded">
          Upload & Verify
        </button>
      </div>
    </div>
  );
}
