// Profile.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/user/me`, { withCredentials: true })
      .then(response => {
        setUser(response.data.user);
        console.log(user)
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        // Handle unauthorized access or other errors here
      });
  }, []);

  if (!user) {
    return <p>Loading user information...</p>;
  }

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Employee ID:</strong> {user.empid}</p>
      <p><strong>Designation:</strong> {user.designation}</p>
    </div>
  );
};

export default Profile;
