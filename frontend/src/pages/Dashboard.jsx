import React, { useEffect, useState } from 'react';
import AllEvents from './AllEvents';
import Profile from './Profile';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MyBookings from './MyBookings';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/user/me`, { withCredentials: true })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        navigate('/login');
      });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (!user) {
    return <p>Loading user information...</p>;
  }

  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const tabs = [
    { key: 'profile', label: 'My Profile' },
    { key: 'upcoming', label: 'Upcoming Events' },
    { key: 'enrolled', label: 'Enrolled Events' },
    { key: 'schedule', label: 'Schedule' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-purple-900 text-white p-4 flex justify-between items-center sticky top-0 z-30">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-xl font-bold">
          Hi, {capitalizeFirstLetter(user.username)} 👋🏻
        </h1>
        <div className="w-6"></div>
      </div>

      <div className="flex">
        {/* Sidebar - Mobile */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40">
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setSidebarOpen(false)}
            ></div>
            <div className="w-64 h-full bg-purple-900 text-white p-6 relative z-50 transform transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  Hi, {capitalizeFirstLetter(user.username)} 👋🏻
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-white focus:outline-none"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <ul className="space-y-4">
                {tabs.map((tab, index) => (
                  <li
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key);
                      setSidebarOpen(false);
                    }}
                    className={`cursor-pointer px-4 py-2 rounded-lg flex items-center gap-3 transition-all ${
                      activeTab === tab.key
                        ? 'bg-white text-purple-900 font-semibold'
                        : 'hover:bg-purple-700'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 text-sm flex items-center justify-center rounded-full ${
                        activeTab === tab.key
                          ? 'bg-purple-200 text-purple-800'
                          : 'bg-purple-600'
                      }`}
                    >
                      {index + 1}
                    </span>
                    {tab.label}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 mt-6 text-white hover:text-purple-300 transition duration-300"
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
                <span className="text-lg font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}

        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-64 h-screen sticky top-0 bg-purple-900 text-white p-6">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 mb-7 text-white-500 hover:text-purple-300 transition duration-300"
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
            <span className="text-lg font-medium">Logout</span>
          </button>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold">
              Hi, {capitalizeFirstLetter(user.username)} 👋🏻
            </h2>
          </div>
          <ul className="space-y-6">
            {tabs.map((tab, index) => (
              <li
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`cursor-pointer px-4 py-2 rounded-lg flex items-center gap-3 transition-all ${
                  activeTab === tab.key
                    ? 'bg-white text-purple-900 font-semibold'
                    : 'hover:bg-purple-700'
                }`}
              >
                <span
                  className={`w-6 h-6 text-sm flex items-center justify-center rounded-full ${
                    activeTab === tab.key
                      ? 'bg-purple-200 text-purple-800'
                      : 'bg-purple-600'
                  }`}
                >
                  {index + 1}
                </span>
                {tab.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-screen p-4 lg:p-10 lg:ml-0 bg-gradient-to-b from-purple-100 to-white">
          <div className="max-w-8xl mx-auto">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <Profile />
              </div>
            )}
            {activeTab === 'upcoming' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <AllEvents />
              </div>
            )}
            {activeTab === 'enrolled' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <MyBookings/>
              </div>
            )}
            {activeTab === 'schedule' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Schedule</h2>
                <p>Scheduling options UI like time slots will go here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;