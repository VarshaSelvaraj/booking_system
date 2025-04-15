import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion'; // Import for animations
import { NotebookIcon } from 'lucide-react';

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

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/user/me`, { withCredentials: true })
      .then(response => {
        setUser(response.data.user);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-purple-100 to-white">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <NotebookIcon className="w-10 h-10 text-purple-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-600">Loading user information...</h1>
        </motion.div>
      </div>
    );
  }

  return (
    
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 shadow-lg flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Profile Image Placeholder (Optional) */}
          <motion.div
            className="w-full md:w-1/2 flex justify-center"
            variants={textVariants}
          >
            <img
              src="https://static.vecteezy.com/system/resources/previews/022/450/297/non_2x/3d-minimal-purple-user-profile-avatar-icon-in-circle-white-frame-design-vector.jpg" // Replace with actual profile image
              alt="Profile Image"
              className="w-48 h-48 rounded-full object-cover shadow-md"
            />
          </motion.div>

          {/* Profile Details */}
          <motion.div
            className="w-full md:w-1/2 text-left"
            variants={textVariants}
          >
            <motion.h2
              className="text-2xl md:text-3xl font-extrabold text-gray-600 mb-6"
              variants={textVariants}
            >
              My Profile
            </motion.h2>
            <motion.p
              className="text-md md:text-lg lg:text-xl text-gray-600 mb-4"
              variants={textVariants}
            >
              Welcome back, {user.username}!
            </motion.p>
            <ul className="list-none text-md md:text-lg text-gray-600">
              <li className="mb-2"><strong>Username:</strong> {user.username}</li>
              <li className="mb-2"><strong>Email:</strong> {user.email}</li>
              <li className="mb-2"><strong>Employee ID:</strong> {user.empid}</li>
              <li className="mb-2"><strong>Designation:</strong> {user.designation}</li>
            </ul>
          </motion.div>
        </div>
      

      
    
  );
};

export default Profile;