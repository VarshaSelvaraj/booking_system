import React, { useEffect, useState } from 'react';
import AllEvents from './AllEvents';
import Profile from './Profile';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/user/me`, { withCredentials: true })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        navigate('/login'); // Redirect to login if unauthorized
      });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      navigate('/login'); // Redirect to login after logout
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
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 h-screen fixed top-0 left-0 bg-purple-800 text-white p-6">
      <button
          onClick={handleLogout} // Navigates back to the previous page
          className="flex items-center space-x-2 mb-7 text-white-500 hover:text-purple-700 transition duration-300"
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
          <span className="text-lg font-medium text-white hover:text-purple-700">Logout</span>
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
      <div className="flex-1 ml-64 p-10">
        {activeTab === 'profile' && (
          <div>
            <Profile />
          </div>
        )}
        {activeTab === 'upcoming' && (
          <div>
            <AllEvents />
          </div>
        )}
        {activeTab === 'enrolled' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Enrolled Events</h2>
            <p>Display the events the user is enrolled in.</p>
          </div>
        )}
        {activeTab === 'schedule' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Schedule</h2>
            <p>Scheduling options UI like time slots will go here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
