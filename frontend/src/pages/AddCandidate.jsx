import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axios from 'axios';

export default function AddCandidate() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    gender: 'MALE',
    email: '',
    dob: '',
    age: '',
    IDseries: '',
    // You don't need to select party, it should be taken from user
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      // You'll need user.politicalPartyId or similar from /profile response.
      const partyId = user.politicalPartyId || user.partyId; // adapt as per your API!
      await axios.post('/api/candidates/addCandidate', {
        ...form,
        politicalPartyId: partyId,
      });
      setSuccess('Candidate added!');
      setTimeout(() => navigate('/candidates'), 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add candidate');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-xl shadow text-gray-900">
      <h2 className="text-2xl font-bold mb-4">Add Candidate</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>First Name</label>
          <input name="firstName" required className="w-full p-2 border rounded" onChange={handleChange} />
        </div>
        <div>
          <label>Last Name</label>
          <input name="lastName" required className="w-full p-2 border rounded" onChange={handleChange} />
        </div>
        <div>
          <label>Username</label>
          <input name="username" required className="w-full p-2 border rounded" onChange={handleChange} />
        </div>
        <div>
          <label>Password</label>
          <input name="password" type="password" required className="w-full p-2 border rounded" onChange={handleChange} />
        </div>
        <div>
          <label>Gender</label>
          <select name="gender" className="w-full p-2 border rounded" onChange={handleChange}>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>
        <div>
          <label>Email</label>
          <input name="email" required type="email" className="w-full p-2 border rounded" onChange={handleChange} />
        </div>
        <div>
          <label>Date of Birth</label>
          <input name="dob" type="date" required className="w-full p-2 border rounded" onChange={handleChange} />
        </div>
        <div>
          <label>Age</label>
          <input name="age" type="number" required className="w-full p-2 border rounded" onChange={handleChange} />
        </div>
        <div>
          <label>ID Series</label>
          <input name="IDseries" required className="w-full p-2 border rounded" onChange={handleChange} />
        </div>
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
          Add Candidate
        </button>
      </form>
    </div>
  );
}
