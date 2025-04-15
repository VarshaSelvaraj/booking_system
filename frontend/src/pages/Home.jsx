import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {NotebookIcon} from 'lucide-react';

const HomePage = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.5 },
    },
  };

  const textVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8 } },
  };

  const buttonVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.6 } },
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-purple-100 to-white text-center overflow-hidden">
      {/* Transparent Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 py-4 px-6 flex items-center justify-between bg-transparent shadow-md z-20">
        <div className="flex items-center space-x-2">
          <NotebookIcon
            className="w-10 h-5 text-purple-500"
          />
          <h1 className="text-xl font-bold text-gray-500">BookSmart</h1>
        </div>
        
      </nav>

      {/* Content Section - Image on Left, Text on Right */}
      <motion.div
        className="z-10 px-4 mt-20 w-full max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-white/20 backdrop-blur-lg rounded-3xl p-8 shadow-lg">
          {/* Image on the Left */}
          <motion.div
            className="w-full md:w-1/2 flex justify-center"
            variants={textVariants}
          >
            <img
              src="https://img.freepik.com/free-vector/appointment-booking-with-calendar_52683-39079.jpg?semt=ais_hybrid&w=740" // Replace with your hero image path
              alt="Hero Image"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </motion.div>

          {/* Text on the Right */}
          <motion.div
            className="w-full md:w-1/2 text-left"
            variants={textVariants}
          >
            <motion.h1
              className="text-3xl md:text-5xl lg:text-5xl font-extrabold text-gray-600 mb-6"
              variants={textVariants}
            >
              Book smarter, manage better
            </motion.h1>
            <motion.p
              className="text-md md:text-lg lg:text-xl text-gray-600 mb-8"
              variants={textVariants}
            >
              Your smart way to book events, track availability, and manage your
              bookings seamlessly.
            </motion.p>
            <motion.div
              className="flex justify-start gap-4"
              variants={textVariants}
            >
              <Link to="/login">
                <motion.button
                  className="bg-violet-400 hover:bg-violet-500 text-white px-6 py-3 rounded-full text-base md:text-lg shadow-md transition duration-300"
                  variants={buttonVariants}
                >
                  Log In
                </motion.button>
              </Link>
              <Link to="/register">
                <motion.button
                  className="border-2 border-violet-400 hover:bg-violet-500 text-violet
                  -700 px-6 py-3 rounded-full text-base md:text-lg shadow-md transition duration-300"
                  variants={buttonVariants}
                >
                  Sign Up
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* SVG Wave (No Animation) */}
      <div
        className="absolute bottom-0 left-0 right-0 w-screen overflow-hidden leading-none z-0"
        style={{ transform: "translateY(0)" }} // Static position
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

export default HomePage;