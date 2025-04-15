import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from "sweetalert2";
const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrollmentModalOpen, setEnrollmentModalOpen] = useState(false); // State for enrollment modal
  const formatDate = (dateString) => {
    const options = {
      weekday: 'long', // Full day name (e.g., "Friday")
      day: 'numeric', // Day of the month (e.g., "4")
      month: 'long', // Full month name (e.g., "April")
      year: 'numeric', // Full year (e.g., "2025")
    };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };
  const imageArray = [
   "https://th.bing.com/th/id/OIP.YrTWdvURj2_v5oecYF2lywHaEK?rs=1&pid=ImgDetMain",
   "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600",
   "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600", 
  ]
  

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = Cookies.get('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/events/getevents`, { withCredentials: true });
        console.log('API Response:', res.data);
        if (Array.isArray(res.data)) {
          const today = new Date(); // Get the current date
          const futureEvents = res.data.filter(event => new Date(event.date) > today); // Filter future events
  
          // Further filter to get events with time greater than the current time
          const filteredEvents = futureEvents.filter(event => {
            const timeSlot = event.time_slot; // Get the time slot
            const endTime = timeSlot.split(' - ')[1]; // Extract the end time
            const [time, modifier] = endTime.split(' '); // Split into time and AM/PM
            const [hours, minutes] = time.split(':').map(Number); // Split into hours and minutes
  
            // Create a new Date object for the end time
            const endDate = new Date();
            endDate.setHours(modifier === 'PM' && hours !== 12 ? hours + 12 : hours); // Convert to 24-hour format
            endDate.setMinutes(minutes); // Set minutes
            endDate.setSeconds(0); // Set seconds to 0
            endDate.setFullYear(new Date(event.date).getFullYear(), new Date(event.date).getMonth(), new Date(event.date).getDate()); // Set the date to the event date
  
            // Compare with the current time
            return endDate > today; // Only include events with end time greater than now
          });
  
          setEvents(filteredEvents); // Set the filtered events
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
  


  const closeModal = () => {
    setSelectedEvent(null);
    setEnrollmentModalOpen(false);
  };
   
  const handleEnroll = (event) => {
    setSelectedEvent(event);
    setEnrollmentModalOpen(true); // Open the enrollment modal
  };
  const handleConfirmEnrollment = async (eventId) => {
    try {
  
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/events/enroll`, { eventId }, { withCredentials: true });  
      console.log('Enrollment Response:', res.data);
      if (res.data.success) { 
         Swal.fire({
                icon: "success",
                title: "Enrolled Successfully",
                text: "Redirecting to dashboard...",
                timer: 3000,
                showConfirmButton: false,
              });
        closeModal(); // Close the modal after successful enrollment    
      } else {
        alert('Enrollment failed. Please try again.');    
      }
    } catch (err) {   
      console.error('Enrollment error:', err);
      alert('An error occurred during enrollment. Please try again later.');  
    }
  };

  if (loading) return <div className="text-center mt-10">Loading events...</div>;
  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-purple-100 to-white overflow-hidden">
      {/* Main Content */}
      <div className={`p-6  bg-white/90 backdrop-blur-lg rounded-xl shadow-lg transition-all duration-300 ${selectedEvent ? 'blur-sm pointer-events-none select-none' : ''}`}>
        <h1 className="text-3xl font-extrabold mb-8 text-center text-purple-900">Upcoming Events</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event,index) => (
            <div
              key={event.id}
              className="bg-white  shadow-md rounded-xl overflow-hidden transition hover:shadow-xl"
            >
              <img src={imageArray[index % imageArray.length]} alt="Event" className="w-full h-48 object-cover" />
            
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{event.event_title}</h2>
                <p className="text-gray-600 text-sm mb-1">
                    <strong></strong> {formatDate(event.date)}
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  <strong></strong> {event.time_slot}
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  <strong>Available Slots:</strong> {event.available_slots}
                </p>
             
                <div className="flex justify-between gap-2">
                 
                  <button className="flex-1 bg-purple-900 hover:bg-purple-700 text-white py-2 px-4 rounded-xl text-sm font-semibold transition duration-300 ease-in-out"
                    onClick={() => handleEnroll(event)}>
                   View Details & Enroll
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
  

{enrollmentModalOpen && selectedEvent && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-lg p-6 relative animate-fadeIn">
      <button
        className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl"
        onClick={closeModal} // Close the modal
      >
        &times;
      </button>
      
      <h2 className="text-2xl font-bold mb-2">{selectedEvent.event_title}</h2>
      <p className="text-gray-700 mb-1"><strong>Date:</strong> {selectedEvent.date}</p>
      <p className="text-gray-700 mb-1"><strong>Time Slot:</strong> {selectedEvent.time_slot}</p>
      <p className="text-gray-700 mb-1"><strong>Mode:</strong> {selectedEvent.mode_of_joining}</p>
      <p className="text-gray-700 mb-1"><strong>Venue:</strong> {selectedEvent.venue}</p>
      <p className="text-gray-700 mb-1"><strong>Contact:</strong> {selectedEvent.contact_mail}</p>
      <p className="text-gray-700 mb-2"><strong>Available Slots:</strong> {selectedEvent.available_slots}</p>
      <p className="text-gray-600 whitespace-pre-wrap">{selectedEvent.description}</p>
      
      <button
        className="mt-4 bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-xl"
        onClick={() => handleConfirmEnrollment(selectedEvent.id)} // Call the confirm function
      >
        Confirm Enrollment
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default AllEvents;