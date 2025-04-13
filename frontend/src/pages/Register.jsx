import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  User,
  Mail,
  BadgeCheck,
  Lock,
} from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    empId: '',
    designation: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[a-z]+\.[a-z]+@jmangroup\.com$/i.test(formData.email)) {
      newErrors.email = 'Email must be in format firstname.lastname@jmangroup.com';
    }

    if (!formData.empId) {
      newErrors.empId = 'Employee ID is required';
    } else if (!/^(INT|JMD)\d{3}$/.test(formData.empId)) {
        newErrors.empId = 'Employee ID must start with INT or JMD followed by 3 digits';
    }
      
    if (!formData.designation) {
      newErrors.designation = 'Designation is required';
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters, include an uppercase letter, a number, and a special character';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fix the highlighted fields.',
      });
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, formData);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Registration successful!',
      });
      setFormData({
        username: '',
        email: '',
        empId: '',
        designation: '',
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.response?.data?.message || 'Something went wrong.',
      });
    }
  };

  const inputFields = [
    { name: 'username', icon: <User className="h-5 w-5 text-gray-400" /> },
    { name: 'email', icon: <Mail className="h-5 w-5 text-gray-400" />, type: 'email' },
    { name: 'password', icon: <Lock className="h-5 w-5 text-gray-400" />, type: 'password' },
    { name: 'confirmPassword', icon: <Lock className="h-5 w-5 text-gray-400" />, type: 'password' },
    { name: 'empId', icon: <BadgeCheck className="h-5 w-5 text-gray-400" /> },
  ];

  const designationOptions = [
    'Software Engineer',
    'Senior Software Engineer',
    'Solution Enabler',
    'Solution Consultant',
    'Solution Architect',
    'Principal Architect',
    'Intern',
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="flex w-auto max-w-4xl rounded-xl shadow-lg overflow-hidden">
        <div className="w-1/4 hidden md:block bg-gradient-to-tr from-indigo-400 to-purple-500 relative">
          <img
            src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTpD4fWJwjrHDxSSE2IOAKLEHJj6NpoQTWCNP7q6GiAoxmpx8s8"
            alt="Login Illustration"
            className="w-full h-100 object-cover opacity-90"
          />
        </div>

        <div className="w-full md:w-3/4 bg-white p-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-1">
            Welcome to <span className="text-purple-500 font-bold">BookSmart</span>
          </h2>
          <p className="text-sm text-gray-500 mb-6">
           Register your account and start booking events.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {inputFields.map(({ name, icon, type }) => (
              <div key={name}>
                <div className={`flex items-center border rounded px-3 py-2 ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}>
                  {icon}
                  <input
                    type={type || (name === 'email' ? 'email' : 'text')}
                    name={name}
                    placeholder={name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')}
                    value={formData[name]}
                    onChange={handleChange}
                    className="ml-2 w-full outline-none bg-transparent text-sm"
                  />
                </div>
                {errors[name] && (
                  <span className="text-xs text-red-500 mt-1 block">{errors[name]}</span>
                )}
              </div>
            ))}

            {/* Designation Dropdown */}
            <div>
              <div className={`flex items-center border rounded px-3 py-2 ${errors.designation ? 'border-red-500' : 'border-gray-300'}`}>
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full outline-none bg-transparent text-sm"
                >
                  <option value="">Select Designation</option>
                  {designationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              {errors.designation && (
                <span className="text-xs text-red-500 mt-1 block">{errors.designation}</span>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition"
            >
              Register
            </button>
          </form>

          <p className="text-center mt-4">
            Already have an account?{' '}
            <a href='/login'>
              <span className="text-blue-600 cursor-pointer hover:underline">Login here</span>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
