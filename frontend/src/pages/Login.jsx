import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
        text: 'Please correct the fields highlighted.',
      });
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, formData);
      const token = res.data.token;

      // Store token in localStorage
      localStorage.setItem('token', token);

      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'Redirecting to dashboard...',
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response?.data?.message || 'Invalid credentials.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="flex w-auto max-w-4xl rounded-xl shadow-lg overflow-hidden">
        {/* Left: Image */}
        <div className="w-1/4 hidden md:block bg-gradient-to-tr from-indigo-400 to-purple-500">
          <img
            src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTpD4fWJwjrHDxSSE2IOAKLEHJj6NpoQTWCNP7q6GiAoxmpx8s8"
            alt="Login Illustration"
            className="w-full h-full object-cover opacity-90"
          />
        </div>

        {/* Right: Form */}
        <div className="w-full md:w-3/4 bg-white p-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-1">
            Welcome to <span className="font-bold">NUVA</span>
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Please log in to your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'email', icon: <Mail className="h-5 w-5 text-gray-400" /> },
              { name: 'password', icon: <Lock className="h-5 w-5 text-gray-400" />, type: 'password' }
            ].map(({ name, icon, type = 'text' }) => (
              <div key={name}>
                <div className={`flex items-center border rounded px-3 py-2 ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}>
                  {icon}
                  <input
                    type={type}
                    name={name}
                    placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
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

            <button
              type="submit"
              className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition"
            >
              Log In
            </button>
          </form>

          <p className="text-center mt-4">
            Don’t have an account?{' '}
            <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate('/register')}>
              Register here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
