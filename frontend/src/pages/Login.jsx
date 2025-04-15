import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please correct the fields highlighted.",
      });
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        formData,
        {
          withCredentials: true, 
        }
      );
      const token = res.data.token;

      // Store token in localStorage


      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Redirecting to dashboard...",
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response?.data?.message || "Invalid credentials.",
      });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-purple-100 to-white text-center overflow-hidden">
      {/* Transparent Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 py-4 px-6 flex items-center justify-start bg-transparent shadow-md z-20">
        <button
          onClick={() => navigate(-1)} // Navigates back to the previous page
          className="flex items-center space-x-2 text-gray-500 hover:text-purple-700 transition duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="text-lg font-medium">Back</span>
        </button>
      </nav>

      {/* Content Section - Image on Left, Text on Right */}
      <div className="z-10 px-4 mt-20 w-auto max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-white/20 backdrop-blur-lg rounded-3xl p-8 shadow-lg">
          {/* Image on the Left */}
          <div className="w-full md:w-1/4 flex justify-center">
            <img
              src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTpD4fWJwjrHDxSSE2IOAKLEHJj6NpoQTWCNP7q6GiAoxmpx8s8"
              alt="Login Illustration"
              className="w-full h-80 rounded-lg shadow-md"
            />
          </div>

          {/* Form on the Right */}
          <div className="w-full md:w-3/4 text-left">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-gray-600 mb-6">
              Hi, Welcome back!
            </h2>
            

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { name: "email", icon: <Mail className="h-5 w-5 text-gray-400" /> },
                { name: "password", icon: <Lock className="h-5 w-5 text-gray-400" />, type: "password" },
              ].map(({ name, icon, type = "text" }) => (
                <div key={name}>
                  <div
                    className={`flex items-center border rounded px-3 py-2 ${
                      errors[name] ? "border-red-500" : "border-gray-300"
                    }`}
                  >
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
                className="w-full bg-violet-400 hover:bg-violet-500 text-white px-6 py-3 rounded-full text-base md:text-lg shadow-md transition duration-300"
              >
                Log In
              </button>
            </form>

            <p className="text-center mt-4 text-gray-600">
              Don’t have an account?{" "}
              <span
                className="text-violet-400 cursor-pointer hover:underline font-semibold"
                onClick={() => navigate("/register")}
              >
                Register here
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* SVG Wave (No Animation) */}
      <div
        className="absolute bottom-0 left-0 right-0 w-screen overflow-hidden leading-none z-0"
        style={{ transform: "translateY(0)" }}
      >
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="w-full h-[100px] md:h-[160px] lg:h-[200px]"
        >
          <path
            fill="#a78bfa"
            fillOpacity="1"
            d="M0,224L48,224C96,224,192,224,288,192C384,160,480,96,576,106.7C672,117,768,203,864,229.3C960,256,1056,224,1152,186.7C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Login;