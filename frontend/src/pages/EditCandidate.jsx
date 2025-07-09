import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCandidate, updateCandidate } from '../api/candidates';

export default function EditCandidate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getCandidate(id)
      .then(res => setForm(res.data))
      .catch(() => setError('Failed to load candidate'));
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await updateCandidate(id, form);
      setSuccess('Candidate updated!');
      setTimeout(() => navigate('/candidates'), 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update candidate');
    }
  };

  if (!form) return <div className="text-center mt-20 text-white">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-xl shadow text-gray-900">
      <h2 className="text-2xl font-bold mb-4">Edit Candidate</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>First Name</label>
          <input name="firstName" required className="w-full p-2 border rounded" onChange={handleChange} value={form.firstName} />
        </div>
        <div>
          <label>Last Name</label>
          <input name="lastName" required className="w-full p-2 border rounded" onChange={handleChange} value={form.lastName} />
        </div>
        <div>
          <label>Email</label>
          <input name="email" required type="email" className="w-full p-2 border rounded" onChange={handleChange} value={form.email} />
        </div>
        <div>
          <label>Gender</label>
          <select name="gender" className="w-full p-2 border rounded" onChange={handleChange} value={form.gender}>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>
        {/* Add other fields as desired */}
        <button type="submit" className="w-full bg-yellow-600 text-white p-2 rounded hover:bg-yellow-700">
          Save Changes
        </button>
      </form>
    </div>
  );
}
