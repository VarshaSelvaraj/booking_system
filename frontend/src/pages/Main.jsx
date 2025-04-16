import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import axios from "axios";
import { motion } from "framer-motion"; // Add this import for animations

const Main = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch upcoming events when component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/getevents`);
        console.log('API Response:', res.data);
        
        if (Array.isArray(res.data)) {
          const today = new Date();
          const futureEvents = res.data.filter(event => new Date(event.date) > today);
          
          const filteredEvents = futureEvents.filter(event => {
            const timeSlot = event.time_slot;
            const endTime = timeSlot.split(' - ')[1];
            const [time, modifier] = endTime.split(' ');
            const [hours, minutes] = time.split(':').map(Number);
  
            const endDate = new Date();
            endDate.setHours(modifier === 'PM' && hours !== 12 ? hours + 12 : hours);
            endDate.setMinutes(minutes);
            endDate.setSeconds(0);
            endDate.setFullYear(new Date(event.date).getFullYear(), new Date(event.date).getMonth(), new Date(event.date).getDate());
            
            return endDate > today;
          });
  
          setUpcomingEvents(filteredEvents.slice(0, 3));
        } else {
          setError('Unexpected response format');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleLoginClick = () => {
    setActiveTab("login");
  };

  const handleRegisterClick = () => {
    setActiveTab("register");
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-600 to-violet-900 relative overflow-hidden">
      {/* Wave Design */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <svg className="absolute bottom-0 left-0 w-full" 
             viewBox="0 0 1440 320" 
             preserveAspectRatio="none">
          <path 
            fill="rgba(255, 255, 255, 0.1)" 
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,117.3C672,107,768,117,864,138.7C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
          </path>
        </svg>
        <svg className="absolute bottom-0 left-0 w-full" 
             viewBox="0 0 1440 320" 
             preserveAspectRatio="none">
          <path 
            fill="rgba(255, 255, 255, 0.05)" 
            d="M0,160L48,144C96,128,192,96,288,101.3C384,107,480,149,576,165.3C672,181,768,171,864,154.7C960,139,1056,117,1152,117.3C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
          </path>
        </svg>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row h-screen relative z-10">
        {/* Left Side - Background with text */}
        <div className="w-4xl md:w-3/4 bg-gradient-to-b from-violet-400 via-violet-300 to-violet-200 flex flex-col justify-center  md:p-16 text-white">
          <motion.div 
            className="max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl text-violet-900 font-extrabold mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              JEvents
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 opacity-90 text-violet-900 "
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
              <h2 className="text-2xl font-semibold mb-4 text-violet-900 ">Upcoming Events</h2>
              {loading ? (
                <div className="flex justify-center p-6">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-900"></div>
                </div>
              ) : error ? (
                <p className="text-red-600">{error}</p>
              ) : upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {upcomingEvents.map((event, index) => (
                    <motion.div 
                      key={event.id} 
                      className="bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-all cursor-pointer h-full"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 * (index + 1), duration: 0.5 }}
                      whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    >
                      <h3 className="font-bold text-lg text-violet-900 opacity-90 ">{event.event_title}</h3>
                      <div className="mt-2 text-xs inline-block bg-violet-900/20 px-3 py-1 rounded-full text-violet-900">
                      {formatDate(event.date)}
                      </div>
                      
                      <p className="text-sm font-bold text-violet-800 opacity-50  mt-1">{event.time_slot}</p>
                    
                     
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  No upcoming events to display.
                </motion.p>
              )}
            </motion.div>

            <motion.div 
              className="space-y-4 md:space-y-0 md:space-x-4 md:flex"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <motion.button
                onClick={handleLoginClick}
                className={`${activeTab === "login" ? "bg-white text-purple-700" : "bg-transparent border-2 border-white text-white hover:bg-white/10"} px-8 py-3 rounded-lg font-semibold shadow-lg w-full md:w-auto transform transition`}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              >
                Log In
              </motion.button>
              <motion.button
                onClick={handleRegisterClick}
                className={`${activeTab === "register" ? "bg-white text-purple-700" : "bg-transparent border-2 border-white text-white hover:bg-white/10"} px-8 py-3 rounded-lg font-semibold w-full md:w-auto transform transition`}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              >
                Create Account
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side - Form Container */}
        <motion.div 
          className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 bg-gray-50"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
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
        </motion.div>
      </div>
    </div>
  );
};

export default Main;