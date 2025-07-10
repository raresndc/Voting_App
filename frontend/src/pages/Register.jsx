// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import { motion } from "framer-motion";

const countryPrefixes = [
  { code: "+40", name: "Romania" },
  { code: "+1", name: "USA" },
];
const countries = [
  { name: "Romania", code: "ROU" },
  { name: "USA", code: "USA" },
  { name: "Germany", code: "DEU" },
  { name: "France", code: "FRA" },
];
const counties = ["Bucharest", "Cluj", "Timiș", "Iași"];
const citiesMap = {
  Bucharest: [
    "Sector 1",
    "Sector 2",
    "Sector 3",
    "Sector 4",
    "Sector 5",
    "Sector 6",
  ],
  Cluj: ["Cluj-Napoca"],
  Timiș: ["Timișoara"],
  Iași: ["Iași"],
};

function calculateAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    phonePrefix: "+40",
    phoneNo: "",
    gender: "MALE",
    email: "",
    personalIdNo: "",
    citizenship: "",
    country: "",
    county: "",
    city: "",
    address: "",
    dob: "",
    idseries: "",
  });
  const [availableCities, setAvailableCities] = useState([]);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const navigate = useNavigate();

  // Helper for client-side field validation
  const validateForm = () => {
    if (!form.firstName.trim() || form.firstName.length < 3) {
      setError("First Name is required (min 3 chars).");
      return false;
    }
    if (!form.lastName.trim() || form.lastName.length < 3) {
      setError("Last Name is required (min 3 chars).");
      return false;
    }
    if (!form.username.trim() || form.username.length < 3) {
      setError("Username is required (min 3 chars).");
      return false;
    }
    if (
      !form.password ||
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-{}\[\]:;"'<>,.?/]).{8,}$/.test(form.password)
    ) {
      setError(
        "Password must be at least 8 characters, contain upper and lower case, a digit, and a special character."
      );
      return false;
    }
    if (!validatePhone(form.phoneNo)) return false;
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Valid email is required.");
      return false;
    }
    if (!form.personalIdNo || !/^\d{13}$/.test(form.personalIdNo)) {
      setError("Personal ID Number must be exactly 13 digits.");
      return false;
    }
    if (!form.citizenship) {
      setError("Please select Citizenship.");
      return false;
    }
    if (!form.country) {
      setError("Please select Country of Residence.");
      return false;
    }
    if (!form.county) {
      setError("Please select County.");
      return false;
    }
    if (!form.city) {
      setError("Please select City.");
      return false;
    }
    if (!form.address.trim()) {
      setError("Address is required.");
      return false;
    }
    if (!form.dob) {
      setError("Date of Birth is required.");
      return false;
    }
    const age = calculateAge(form.dob);
    if (!age || age < 0 || age > 120) {
      setError("Please provide a valid Date of Birth.");
      return false;
    }
    setError("");
    return true;
  };

  // Phone validator
  const validatePhone = (value) => {
    if (!/^[0-9]{9}$/.test(value)) {
      setPhoneError("Phone must be 9 digits (e.g. 712345678)");
      return false;
    }
    setPhoneError("");
    return true;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "county") {
      setAvailableCities(citiesMap[value] || []);
      setForm((prev) => ({ ...prev, city: "" }));
    }
    if (name === "phoneNo") {
      validatePhone(value);
    }
  };

  // Final submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      // Find the code for citizenship from countries array if user somehow enters value manually
      const citizenshipCode =
        countries.find((c) => c.code === form.citizenship)?.code ||
        countries.find((c) => c.name === form.citizenship)?.code ||
        form.citizenship;
      const submitForm = {
        ...form,
        phoneNo: `${form.phonePrefix}${form.phoneNo.replace(/^0+/, "")}`,
        citizenship: citizenshipCode,
        age: calculateAge(form.dob),
      };
      delete submitForm.phonePrefix; // backend doesn't want it
      // Optionally clean idseries if blank
      if (!submitForm.idseries?.trim()) delete submitForm.idseries;
      console.log("Submitting:", submitForm); // DEBUG, remove if not needed
      await registerUser(submitForm);
      navigate("/verify", { state: { username: form.username } });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 overflow-hidden">
      {/* Background Animations */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 4,
        }}
        className="absolute w-96 h-96 bg-white bg-opacity-10 rounded-full top-16 left-8"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 0.8 }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 3,
        }}
        className="absolute w-80 h-80 bg-white bg-opacity-5 rounded-full bottom-16 right-8"
      />

      <motion.form
        onSubmit={handleSubmit}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="relative bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-2xl z-10"
        style={{ boxShadow: "0 4px 40px 0 rgba(0,0,0,0.45)" }}
      >
        <h2 className="text-3xl font-bold mb-6 text-white text-center drop-shadow-md">
          Register
        </h2>
        {error && <p className="text-red-300 text-center mb-4">{error}</p>}

        {/* Two-column grid for compact form layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <label className="text-white font-medium">First Name</label>
            <input
              name="firstName"
              onChange={handleChange}
              required
              className="w-full p-2 rounded-lg mt-1 bg-white bg-opacity-25 text-white placeholder-gray-300 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-white font-medium">Last Name</label>
            <input
              name="lastName"
              onChange={handleChange}
              required
              className="w-full p-2 rounded-lg mt-1 bg-white bg-opacity-25 text-white placeholder-gray-300 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-white font-medium">Username</label>
            <input
              name="username"
              onChange={handleChange}
              required
              className="w-full p-2 rounded-lg mt-1 bg-white bg-opacity-25 text-white placeholder-gray-300 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-white font-medium">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              required
              className="w-full p-2 rounded-lg mt-1 bg-white bg-opacity-25 text-white placeholder-gray-300 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-white font-medium">Phone Prefix</label>
            <select
              name="phonePrefix"
              onChange={handleChange}
              value={form.phonePrefix}
              className="w-full p-2 rounded-lg mt-1 bg-white bg-opacity-25 text-white focus:outline-none"
            >
              {countryPrefixes.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-white font-medium">Phone Number</label>
            <input
              name="phoneNo"
              type="tel"
              inputMode="numeric"
              pattern="^[0-9]{9}$"
              placeholder="712345678"
              onChange={handleChange}
              value={form.phoneNo}
              required
              className={`w-full p-2 rounded-lg mt-1 bg-white bg-opacity-25 text-white placeholder-gray-300 focus:outline-none border ${
                phoneError ? "border-red-400" : "border-transparent"
              }`}
            />
            {phoneError && (
              <div className="text-red-300 text-xs mt-1">{phoneError}</div>
            )}
          </div>
          <div>
            <label className="text-white font-medium">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full p-2 rounded-lg mt-1 bg-white bg-opacity-25 text-white focus:outline-none"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>
          <div>
            <label className="text-white font-medium">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              required
              className="w-full p-2 rounded-lg mt-1 bg-white bg-opacity-25 text-white placeholder-gray-300 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-white font-medium">Personal ID Number</label>
            <input
              name="personalIdNo"
              pattern="^\d{13}$"
              inputMode="numeric"
              placeholder="1234567890123"
              onChange={handleChange}
              required
              className="w-full p-2 rounded-lg mt-1 bg-white bg-opacity-25 text-white placeholder-gray-300 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-white font-medium">Citizenship</label>
            <select
              name="citizenship"
              onChange={handleChange}
              required
              className="w-full p-2 rounded-lg mt-1 bg-white bg-opacity-25 text-white focus:outline-none"
              value={form.citizenship}
            >
              <option value="">Select</option>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-white font-medium">
              Country of Residence
            </label>
            <select
              name="country"
              onChange={handleChange}
              required
              className="w-full p-2 rounded-lg mt-1 bg-white bg-opacity-25 text-white focus:outline-none"
              value={form.country}
            >
              <option value="">Select</option>
              {countries.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-white font-medium">County</label>
            <select
              name="county"
              onChange={handleChange}
              required
              className="w-full p-2 rounded-lg mt-1 bg-white bg-opacity-25 text-white focus:outline-none"
            >
              <option value="">Select</option>
              {counties.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-white font-medium">City</label>
            <select
              name="city"
              onChange={handleChange}
              required
              className="w-full p-2 rounded-lg mt-1 bg-white bg-opacity-25 text-white focus:outline-none"
            >
              <option value="">Select</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-white font-medium">Address</label>
            <input
              name="address"
              onChange={handleChange}
              required
              placeholder="Street, No., District"
              className="w-full p-2 rounded-lg mt-1 bg-white bg-opacity-25 text-white placeholder-gray-300 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-white font-medium">Date of Birth</label>
            <input
              type="date"
              name="dob"
              onChange={handleChange}
              required
              className="w-full p-2 rounded-lg mt-1 bg-white bg-opacity-25 text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="text-white font-medium">ID Series</label>
            <input
              name="idseries"
              pattern="[A-Za-z]{2}\d{6}"
              onChange={handleChange}
              className="w-full p-2 rounded-lg mt-1 bg-white bg-opacity-25 text-white placeholder-gray-300 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full mt-8 py-3 bg-green-600 rounded-xl text-white font-semibold text-lg shadow-lg hover:bg-green-700 transition"
        >
          Register
        </motion.button>
      </motion.form>
    </div>
  );
}
