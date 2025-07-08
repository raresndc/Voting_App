// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';
import { motion } from 'framer-motion';

const countryPrefixes = [
  { code: '+40', name: 'Romania' },
  { code: '+1', name: 'USA' },
];
const countries = ['Romania', 'USA', 'Germany', 'France'];
const counties = ['Bucharest', 'Cluj', 'Timiș', 'Iași'];
const citiesMap = {
  Bucharest: ['Sector 1', 'Sector 2', 'Sector 3', 'Sector 4'],
  Cluj: ['Cluj-Napoca'],
  'Timiș': ['Timișoara'],
  Iași: ['Iași'],
};

export default function Register() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    phonePrefix: '+40',
    phoneNo: '',
    gender: 'MALE',
    email: '',
    personalIdNo: '',
    citizenship: '',
    country: '',
    county: '',
    city: '',
    address: '',
    dob: '',
    IDseries: '',
  });
  const [availableCities, setAvailableCities] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'county') {
      setAvailableCities(citiesMap[value] || []);
      setForm(prev => ({ ...prev, city: '' }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await registerUser(form);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 overflow-hidden">
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

      <motion.form
        onSubmit={handleSubmit}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
        className="relative bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-xl shadow-xl w-full max-w-2xl grid grid-cols-1 gap-6 z-10 text-gray-900"
      >
        <h2 className="text-3xl font-bold mb-4 text-white drop-shadow-md col-span-full">Register</h2>
        {error && <p className="text-red-400 mb-4 col-span-full">{error}</p>}

        {/* First & Last Name */}
        <div className="grid grid-cols-2 gap-4 col-span-full">
          <motion.div whileHover={{ scale: 1.02 }}>
            <label className="text-white">First Name</label>
            <input name="firstName" onChange={handleChange} required className="w-full p-2 rounded bg-white bg-opacity-25 text-white placeholder-white focus:outline-none" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }}>
            <label className="text-white">Last Name</label>
            <input name="lastName" onChange={handleChange} required className="w-full p-2 rounded bg-white bg-opacity-25 text-white placeholder-white focus:outline-none" />
          </motion.div>
        </div>

        {/* Username & Password */}
        <motion.div whileHover={{ scale: 1.02 }}>
          <label className="text-white">Username</label>
          <input name="username" onChange={handleChange} required className="w-full p-2 rounded bg-white bg-opacity-25 text-white placeholder-white focus:outline-none" />
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }}>
          <label className="text-white">Password</label>
          <input type="password" name="password" onChange={handleChange} required className="w-full p-2 rounded bg-white bg-opacity-25 text-white placeholder-white focus:outline-none" />
        </motion.div>

        {/* Phone Prefix & Number */}
        <div className="flex gap-4 col-span-full">
          <motion.div whileHover={{ scale: 1.02 }}>
            <label className="text-white">Phone Prefix</label>
            <select name="phonePrefix" onChange={handleChange} value={form.phonePrefix} className="p-2 rounded bg-white bg-opacity-25 text-white focus:outline-none">
              {countryPrefixes.map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
            </select>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} className="flex-1">
            <label className="text-white">Phone Number</label>
            <input name="phoneNo" type="tel" inputMode="numeric" pattern="\\d+" placeholder="712345678" onChange={handleChange} required className="w-full p-2 rounded bg-white bg-opacity-25 text-white placeholder-white focus:outline-none" />
          </motion.div>
        </div>

        {/* Gender & Email */}
        <div className="flex gap-4 col-span-full">
          <motion.div whileHover={{ scale: 1.02 }}>
            <label className="text-white">Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange} className="w-full p-2 rounded bg-white bg-opacity-25 text-white focus:outline-none">
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }}>
            <label className="text-white">Email</label>
            <input type="email" name="email" onChange={handleChange} required className="w-full p-2 rounded bg-white bg-opacity-25 text-white placeholder-white focus:outline-none" />
          </motion.div>
        </div>

        {/* Personal ID Number */}
        <motion.div whileHover={{ scale: 1.02 }}>
          <label className="text-white">Personal ID Number</label>
          <input name="personalIdNo" pattern="^\\d{13}$" inputMode="numeric" placeholder="1234567890123" onChange={handleChange} required className="w-full p-2 rounded bg-white bg-opacity-25 text-white placeholder-white focus:outline-none" />
        </motion.div>

        {/* Citizenship & Country */}
        <div className="grid grid-cols-2 gap-4 col-span-full">
          <motion.div whileHover={{ scale: 1.02 }}>
            <label className="text-white">Citizenship</label>
            <select name="citizenship" onChange={handleChange} className="w-full p-2 rounded bg-white bg-opacity-25 text-white focus:outline-none">
              <option value="">Select</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }}>
            <label className="text-white">Country of Residence</label>
            <select name="country" onChange={handleChange} required className="w-full p-2 rounded bg-white bg-opacity-25 text-white focus:outline-none">
              <option value="">Select</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </motion.div>
        </div>

        {/* County, City, Address */}
        <div className="grid grid-cols-3 gap-4 col-span-full">
          <motion.div whileHover={{ scale: 1.02 }}>
            <label className="text-white">County</label>
            <select name="county" onChange={handleChange} required className="w-full p-2 rounded bg-white bg-opacity-25 text-white focus:outline-none">
              <option value="">Select</option>
              {counties.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }}>
            <label className="text-white">City</label>
            <select name="city" onChange={handleChange} required className="w-full p-2 rounded bg-white bg-opacity-25 text-white focus:outline-none">
              <option value="">Select</option>
              {availableCities.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }}>
            <label className="text-white">Address</label>
            <input name="address" onChange={handleChange} required placeholder="Street, No., District" className="w-full p-2 rounded bg-white bg-opacity-25 text-white placeholder-white focus:outline-none" />
          </motion.div>
        </div>

        {/* DOB & ID Series */}
        <div className="grid grid-cols-2 gap-4 col-span-full">
          <motion.div whileHover={{ scale: 1.02 }}>
            <label className="text-white">Date of Birth</label>
            <input type="date" name="dob" onChange={handleChange} required className="w-full p-2 rounded bg-white bg-opacity-25 text-white focus:outline-none" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }}>
            <label className="text-white">ID Series</label>
            <input name="IDseries" pattern="[A-Za-z]{2}\d{6}" onChange={handleChange} required className="w-full p-2 rounded bg-white bg-opacity-25 text-white placeholder-white focus:outline-none" />
          </motion.div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="col-span-full py-3 bg-green-600 rounded-lg text-white font-semibold hover:bg-green-700 transition"
        >
          Register
        </motion.button>
      </motion.form>
    </div>
  );
}
