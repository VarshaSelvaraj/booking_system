import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  User,
  Mail,
  BadgeCheck,
  Lock,
  Eye,
  EyeOff,
  Briefcase
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    empId: "",
    designation: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores, with no spaces";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[a-z]+\.[a-z]+@jmangroup\.com$/i.test(formData.email)) {
      newErrors.email = "Email must be in format firstname.lastname@jmangroup.com";
    }

    if (!formData.empId) {
      newErrors.empId = "Employee ID is required";
    } else if (!/^(INT|JMD)\d{3}$/.test(formData.empId)) {
      newErrors.empId = "Employee ID must start with INT or JMD followed by 3 digits";
    }

    if (!formData.designation) {
      newErrors.designation = "Designation is required";
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Password must be at least 8 characters, include an uppercase letter, a number, and a special character";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fix the highlighted fields.",
      });
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, formData);
      Swal.fire({
        icon: "success",
        title: "Success",
        iconColor: '#8B5CF6',
        text: "Registration successful! You can now login.",
        timer: 2000,
        showConfirmButton: false
      });
      
      setTimeout(() => {
        navigate("/main");
      }, 2000);
      
    } catch (error) {
      console.error("Registration error:", error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  const designationOptions = [
    "Software Engineer",
    "Senior Software Engineer",
    "Solution Enabler",
    "Solution Consultant",
    "Solution Architect",
    "Principal Architect",
    "Intern",
  ];

  return (
    <div >
      {/* Transparent Navigation Bar */}
      
      {/* Content Section */}
      <div className="z-10 px-4 mt-20 w-auto max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8   ">
          {/* Image on the Left */}
         

          {/* Form on the Right */}
          <div className="w-auto text-left">
            <h2 className="text-xl md:text-3xl font-extrabold text-violet-900  mb-2">
              Create Your Account
            </h2>
            <p className="text-violet-900  mb-6">Join our team and start your journey</p>

            <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div>
            <div className={`flex items-center rounded-lg border ${
              errors.username ? "border-red-400" : "border-gray-200 focus-within:border-violet-500"
            } px-4 py-3 transition-colors duration-200`}>
              <User className="h-5 w-5 text-violet-800" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="ml-3 w-full bg-transparent text-gray-700 outline-none placeholder:text-gray-400"
              />
            </div>
            {errors.username && (
              <span className="mt-1 block text-xs text-red-500">{errors.username}</span>
            )}
          </div>

          {/* Email Field */}
          <div>
            <div className={`flex items-center rounded-lg border ${
              errors.email ? "border-red-400" : "border-gray-200 focus-within:border-violet-500"
            } px-4 py-3 transition-colors duration-200`}>
              <Mail className="h-5 w-5 text-violet-800" />
              <input
                type="email"
                name="email"
                placeholder="firstname.lastname@jmangroup.com"
                value={formData.email}
                onChange={handleChange}
                className="ml-3 w-full bg-transparent text-gray-700 outline-none placeholder:text-gray-400"
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <span className="mt-1 block text-xs text-red-500">{errors.email}</span>
            )}
          </div>

          {/* Employee ID Field */}
          <div>
            <div className={`flex items-center rounded-lg border ${
              errors.empId ? "border-red-400" : "border-gray-200 focus-within:border-violet-500"
            } px-4 py-3 transition-colors duration-200`}>
              <BadgeCheck className="h-5 w-5 text-violet-800" />
              <input
                type="text"
                name="empId"
                placeholder="Employee ID (e.g., INT123 or JMD456)"
                value={formData.empId}
                onChange={handleChange}
                className="ml-3 w-full bg-transparent text-gray-700 outline-none placeholder:text-gray-400"
              />
            </div>
            {errors.empId && (
              <span className="mt-1 block text-xs text-red-500">{errors.empId}</span>
            )}
          </div>

          {/* Designation Dropdown */}
          <div>
            <div className={`flex items-center rounded-lg border ${
              errors.designation ? "border-red-400" : "border-gray-200 focus-within:border-violet-500"
            } px-4 py-3 transition-colors duration-200`}>
              <Briefcase className="h-5 w-5 text-violet-800" />
              <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="ml-3 w-full appearance-none bg-transparent text-gray-700 outline-none"
              >
                <option value="">Select Designation</option>
                {designationOptions.map((option) => (
                  <option key={option}  value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            {errors.designation && (
              <span className="mt-1 block text-xs text-red-500">{errors.designation}</span>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className={`flex items-center rounded-lg border ${
              errors.password ? "border-red-400" : "border-gray-200 focus-within:border-violet-500"
            } px-4 py-3 transition-colors duration-200`}>
              <Lock className="h-5 w-5 text-violet-800" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="ml-3 w-full bg-transparent text-gray-700 outline-none placeholder:text-gray-400"
              />
              <button 
                type="button" 
                onClick={togglePasswordVisibility}
                className="focus:outline-none"
              >
                
              </button>
            </div>
            {errors.password && (
              <span className="mt-1 block text-xs text-red-500">{errors.password}</span>
            )}
          </div>
          <div>
            <div className={`flex items-center rounded-lg border ${
              errors.confirmPassword ? "border-red-400" : "border-gray-200 focus-within:border-violet-500"
            } px-4 py-3 transition-colors duration-200`}>
              <Lock className="h-5 w-5 text-violet-800" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="ml-3 w-full bg-transparent text-gray-700 outline-none placeholder:text-gray-400"
              />
              <button 
                type="button" 
                onClick={toggleConfirmPasswordVisibility}
                className="focus:outline-none"
              >
                
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="mt-1 block text-xs text-red-500">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{    backgroundImage: 'linear-gradient(135deg, #b3a0f0, #a77bde)' }}
            className="flex w-full items-center justify-center space-x-2 rounded-lg bg-violet-600 px-4 py-3 font-medium text-white shadow transition-all duration-300 hover:bg-violet-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"          >
            {loading ? (
              <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Get Started..."
            )}
          </button>
          
         
        </form>
           
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default Register;