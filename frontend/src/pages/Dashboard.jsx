import React, { useEffect, useState } from 'react';
import AllEvents from './AllEvents';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MyBookings from './MyBookings';
import Schedule from './Schedule';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
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
        navigate('/main');
      });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      navigate('/main');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleBack = () => {
    handleLogout();
    navigate('/main');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-400 to-purple-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-white rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-white rounded mb-2"></div>
          <p className="text-white">Loading user information...</p>
        </div>
      </div>
    );
  }

  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const tabs = [
    { 
      key: 'upcoming', 
      label: 'Upcoming Events',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      key: 'enrolled', 
      label: 'My Bookings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    { 
      key: 'schedule', 
      label: 'Schedule',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ];
  
  return (
    <div className="min-h-screen ">
  
      {/* Mobile Header */}
      <div className="lg:hidden bg-gradient-to-b from-purple-400 via-purple-300 to-purple-200 text-white p-4 flex justify-between items-center sticky top-0 z-30 shadow-md">
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
          {tabs.find(tab => tab.key === activeTab)?.label || 'Dashboard'}
        </h1>
        <button
          onClick={handleBack}
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
      </div>

      <div className="flex relative z-10">
        {/* Sidebar - Mobile */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40">
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setSidebarOpen(false)}
            ></div>
            <div className="w-64 h-full bg-gradient-to-b from-purple-400 via-purple-300 to-purple-200 text-white flex flex-col relative z-50 transform transition-all duration-300 shadow-xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white text-purple-600 flex items-center justify-center mr-3 font-bold text-lg shadow-md">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    {capitalizeFirstLetter(user.username)}
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
                <div className="border-b border-purple-400 mb-6 pb-6">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-purple-100 text-sm">{user.email}</span>
                  </div>
                </div>
                <ul className="space-y-2">
                  {tabs.map((tab) => (
                    <li
                      key={tab.key}
                      onClick={() => {
                        setActiveTab(tab.key);
                        setSidebarOpen(false);
                      }}
                      className={`cursor-pointer px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                        activeTab === tab.key
                          ? 'bg-white text-purple-600 font-semibold shadow-md'
                          : 'hover:bg-purple-400'
                      }`}
                    >
                      <span
                        className={`${
                          activeTab === tab.key
                            ? 'text-purple-600'
                            : 'text-purple-100'
                        }`}
                      >
                        {tab.icon}
                      </span>
                      {tab.label}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto p-6 border-t border-purple-400">
                <button
                  onClick={handleBack}
                  className="flex items-center space-x-2 w-full px-4 py-2 mb-3 text-white hover:bg-purple-400 rounded-lg transition duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 17l-5-5m0 0l5-5m-5 5h12"
                    />
                  </svg>
                  <span>Back to Homepage</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 mt-2 text-white font-medium rounded-lg bg-purple-600 hover:bg-purple-700 transition duration-300 shadow-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar - Desktop */}
        <div className="hidden lg:flex lg:flex-col w-72 h-screen sticky top-0 bg-gradient-to-b from-purple-100 via-purple-150 to-purple-200 text-white shadow-lg">
          <div className="p-6 flex-1">
          
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 mb-7 text-white hover:text-purple-200 transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-purple-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 17l-5-5m0 0l5-5m-5 5h12"
                />
              </svg>
              <span className="text-lg text-purple-900">Back to Homepage</span>
            </button>

            <div className="flex items-center mb-4">
              <div className="w-14 h-14 rounded-full bg-white text-purple-600 flex items-center justify-center mr-4 font-bold text-xl shadow-md">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl text-purple-900 font-bold">
                  {capitalizeFirstLetter(user.username)}
                </h2>
                <p className="text-purple-900 text-sm">{user.email}</p>
              </div>
            </div>

            <div className="border-b border-purple-400 my-6"></div>
            <nav className="mt-8">
              <ul className="space-y-2">
                {tabs.map((tab) => (
                  <li
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`cursor-pointer px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                      activeTab === tab.key
                        ? 'bg-white text-purple-600 font-semibold shadow-md'
                        : 'hover:bg-purple-400 text-purple-900'
                    }`}
                  >
                    <span
                      className={`${
                        activeTab === tab.key
                          ? 'text-purple-600'
                          : 'text-purple-900'
                      }`}
                    >
                      {tab.icon}
                    </span>
                    {tab.label}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="p-6 border-t border-purple-400">
            <button
              onClick={handleLogout}
              style={{ backgroundImage: 'linear-gradient(135deg,rgb(198, 183, 212), #9333ea)' }}
              className="flex items-center justify-center space-x-2 w-full px-4 py-3 text-white font-medium rounded-lg transition duration-300 shadow-md transform hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Log Out</span>
            </button>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 min-h-screen">
          <div className="max-w-8xl mx-auto p-4 lg:p-6">
            <div className="">
              {activeTab === 'upcoming' && <AllEvents />}
              {activeTab === 'enrolled' && <MyBookings />}
              {activeTab === 'schedule' && <Schedule />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;