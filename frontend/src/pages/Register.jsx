import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";

const countryPrefixes = [
  { code: "+40", name: "Romania" },
  { code: "+1", name: "USA" },
  // add more countries
];

const countries = ["Romania", "USA", "Germany", "France"];
const counties = ["Bucharest", "Cluj", "Timiș", "Iași"];
const cities = {
  Bucharest: ["Sector 1", "Sector 2", "Sector 3", "Sector 4"],
  Cluj: ["Cluj-Napoca"],
  Timiș: ["Timișoara"],
  Iași: ["Iași"],
};

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
    IDseries: "",
  });
  const [availableCities, setAvailableCities] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "county") setAvailableCities(cities[value] || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white text-gray-900 p-8 rounded-lg shadow-lg w-full max-w-2xl grid grid-cols-1 gap-6"
      >
        <h2 className="col-span-full text-2xl">Register</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>First Name</label>
            <input
              name="firstName"
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label>Last Name</label>
            <input
              name="lastName"
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div>
          <label>Username</label>
          <input
            name="username"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex gap-2">
          <div>
            <label>Phone Prefix</label>
            <select
              name="phonePrefix"
              onChange={handleChange}
              value={form.phonePrefix}
              className="p-2 border rounded"
            >
              {countryPrefixes.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label>Phone Number</label>
            <input
              name="phoneNo"
              type="tel"
              inputMode="numeric"
              pattern="\d+"
              placeholder="712345678"
              maxLength={9}
              required
              className="w-full p-2 border rounded text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div>
            <label>Gender</label>
            <select
              name="gender"
              onChange={handleChange}
              value={form.gender}
              className="p-2 border rounded"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div>
          <label>Personal ID Number</label>
          <input
            name="personalIdNo"
            onChange={handleChange}
            pattern="^\d{13}$"
            inputMode="numeric"
            placeholder="1234567890123"
            required
            className="w-full p-2 border rounded bg-white text-gray-900 placeholder-gray-400"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Citizenship</label>
            <select
              name="citizenship"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Country of Residence</label>
            <select
              name="country"
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label>County</label>
            <select
              name="county"
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
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
            <label>City</label>
            <select
              name="city"
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Address</label>
            <input
              name="address"
              onChange={handleChange}
              required
              placeholder="Street, No., District if Bucharest"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label>ID Series</label>
            <input
              name="IDseries"
              onChange={handleChange}
              pattern="[A-Za-z]{2}\d{6}"
              required
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <button
          type="submit"
          className="col-span-full py-2 bg-green-600 text-white rounded-lg"
        >
          Register
        </button>
      </form>
    </div>
  );
}
