import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-purple-100 to-white text-center overflow-hidden">
      {/* Content */}
      <div className="z-10 px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 mb-6">
          Welcome to <span className="text-purple-700">BookSmart</span>
        </h1>
        <p className="text-md md:text-lg lg:text-xl text-gray-600 max-w-xl mx-auto mb-8">
          Your smart way to book events, track availability, and manage your bookings seamlessly.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/login">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full text-base md:text-lg shadow-md transition duration-300">
              Log In
            </button>
          </Link>
          <Link to="/register">
            <button className="border-2 border-purple-600 hover:bg-purple-50 text-purple-700 px-6 py-3 rounded-full text-base md:text-lg shadow-md transition duration-300">
              Sign Up
            </button>
          </Link>
        </div>
      </div>

      {/* SVG Wave */}
      <div className="absolute bottom-0 left-0 right-0 w-screen overflow-hidden leading-none z-0">
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

export default HomePage;
