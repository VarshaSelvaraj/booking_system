import React, { useState, useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import axios from "axios";
import { motion } from "framer-motion";

const Main = () => {
  const location = useLocation();
  
  const activeTabFromRegister = location.state?.activeTab;
  const [activeTab, setActiveTab] = useState(activeTabFromRegister || "login");
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  

  // Fetch upcoming events when component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/getevents`
        );
        console.log("API Response:", res.data);

        if (Array.isArray(res.data)) {
          const today = new Date();
          const futureEvents = res.data.filter(
            (event) => new Date(event.date) > today
          );

          const filteredEvents = futureEvents.filter((event) => {
            const timeSlot = event.time_slot;
            const endTime = timeSlot.split(" - ")[1];
            const [time, modifier] = endTime.split(" ");
            const [hours, minutes] = time.split(":").map(Number);

            const endDate = new Date();
            endDate.setHours(
              modifier === "PM" && hours !== 12 ? hours + 12 : hours
            );
            endDate.setMinutes(minutes);
            endDate.setSeconds(0);
            endDate.setFullYear(
              new Date(event.date).getFullYear(),
              new Date(event.date).getMonth(),
              new Date(event.date).getDate()
            );

            return endDate > today;
          });

          setUpcomingEvents(filteredEvents.slice(0, 3));
        } else {
          setError("Unexpected response format");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);
  const handleLoginClick = () => {
    setActiveTab("login");
  };

  const handleRegisterClick = () => {
    setActiveTab("register");
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden bg-gradient-to-b from-purple-400 via-purple-300 to-purple-200 text-white p-4 flex justify-between items-center sticky top-0 z-30 shadow-md">
        <h1 className="text-xl font-bold">JEvents</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleLoginClick}
            className={`px-3 py-1 rounded-lg text-sm ${
              activeTab === "login"
                ? "bg-white text-purple-600"
                : "bg-transparent border border-white"
            }`}
          >
            Login
          </button>
          <button
            onClick={handleRegisterClick}
            className={`px-3 py-1 rounded-lg text-sm ${
              activeTab === "register"
                ? "bg-white text-purple-600"
                : "bg-transparent border border-white"
            }`}
          >
            Register
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Info Section */}
        <div className="w-full lg:w-3/4 p-6 lg:p-12 flex flex-col justify-center">
          <motion.div
            className="max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="hidden lg:block mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl text-purple-900 font-extrabold">
                JEvents
              </h1>
              <div className="h-1 w-20 bg-gradient-to-r from-purple-900 to-purple-300 mt-3 mb-6"></div>
            </motion.div>

            <motion.p
              className="text-xl mb-8 text-purple-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Your one-stop platform for discovering and joining amazing events.
              Connect with communities and expand your horizons.
            </motion.p>

            {/* Upcoming Events Section */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="flex items-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-violet-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h2 className="text-2xl font-semibold text-violet-900">
                  Upcoming Events
                </h2>
              </div>

              {loading ? (
                <div className="flex justify-center p-6">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
                </div>
              ) : error ? (
                <p className="text-red-600">{error}</p>
              ) : upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {upcomingEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      className="bg-white rounded-lg p-4 shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-violet-900"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 * (index + 1), duration: 0.5 }}
                      whileHover={{ scale: 1.03 }}
                    >
                      <h3 className="font-bold text-lg text-purple-900">
                        {event.event_title}
                      </h3>
                      <div className="mt-2 text-xs inline-block bg-purple-100 px-3 py-1 rounded-full text-purple-800">
                        {formatDate(event.date)}
                      </div>
                      <p className="text-sm font-medium text-violet-900 mt-1">
                        {event.time_slot}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  className="bg-white rounded-lg p-6 shadow-lg border border-purple-100 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-purple-300 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <p className="text-purple-900">
                    No upcoming events to display.
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Desktop */}
            <motion.div
              className="hidden lg:flex space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <motion.button
                onClick={handleLoginClick}
                className={`px-8 py-3 rounded-lg font-semibold shadow-lg transform transition ${
                  activeTab === "login"
                    ? "bg-white text-purple-900 border-2 border-purple-900"
                    : "bg-gradient-to-r from-purple-400 to-purple-300 text-white hover:from-purple-500 hover:to-purple-600"
                }`}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              >
                Log In
              </motion.button>
              <motion.button
                onClick={handleRegisterClick}
                className={`px-8 py-3 rounded-lg font-semibold shadow-lg transform transition ${
                  activeTab === "register"
                    ? "bg-white text-purple-900 border-2 border-purple-900"
                    : "bg-gradient-to-r from-purple-400 to-purple-300 text-white hover:from-purple-500 hover:to-purple-600"
                }`}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              >
                Create Account
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Form Container */}
        <motion.div
          className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white lg:bg-gradient-to-b lg:from-white lg:to-white lg:shadow-2xl lg:shadow-purple-100"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-full max-w-md lg:p-8">
            <div className="mb-6 lg:hidden">
              <div className="bg-purple-100 p-1 rounded-lg flex">
                <button
                  onClick={handleLoginClick}
                  className={`flex-1 py-2 rounded-md text-center transition-all ${
                    activeTab === "login"
                      ? "bg-white text-purple-900 shadow-sm font-medium"
                      : "text-purple-600"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={handleRegisterClick}
                  className={`flex-1 py-2 rounded-md text-center transition-all ${
                    activeTab === "register"
                      ? "bg-white text-purple-900 shadow-sm font-medium"
                      : "text-purple-600"
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            {activeTab === "login" ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Login />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Register />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Main;
