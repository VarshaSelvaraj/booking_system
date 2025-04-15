import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from "sweetalert2";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrollmentModalOpen, setEnrollmentModalOpen] = useState(false);

  const formatDate = (dateString) => {
    const options = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  const imageArray = [
   "https://th.bing.com/th/id/OIP.YrTWdvURj2_v5oecYF2lywHaEK?rs=1&pid=ImgDetMain",
   "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600",
   "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600", 
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = Cookies.get('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/events/getevents`, { withCredentials: true });
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
  
          setEvents(filteredEvents);
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
    setEnrollmentModalOpen(true);
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
        closeModal();    
      } else {
        alert('Enrollment failed. Please try again.');    
      }
    } catch (err) {   
      console.error('Enrollment error:', err);
      if (err.response?.data?.message === 'You are already enrolled in this event') {
        Swal.fire({
          icon: "info",
          title: "Already Enrolled",
          text: "You have already enrolled in this event.",
          timer: 3000,
          showConfirmButton: false,
        });
      } else {
        alert('An error occurred during enrollment. Please try again later.');
      }
        }
  };

  // Calculate total seats and enrollment percentage
  const calculateEnrollmentStats = (event) => {
    const totalSeats = event.available_slots ;
    const enrollmentPercentage = Math.round((event.slots_booked / totalSeats) * 100);
    const isFull = event.slots_booked >= totalSeats;
    return { totalSeats, enrollmentPercentage, isFull };
  };

  if (loading) return <div className="text-center mt-10">Loading events...</div>;
  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-purple-100 to-white overflow-hidden">
      {/* Main Content */}
      <div className={`p-6 shadow-lg transition-all duration-300 ${selectedEvent ? 'blur-sm pointer-events-none select-none' : ''}`}>
        <h1 className="text-3xl font-extrabold mb-8 text-center text-purple-900">Upcoming Events</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => {
            const { totalSeats, enrollmentPercentage, isFull } = calculateEnrollmentStats(event);
            return (
              <div
                key={event.id}
                className="bg-white shadow-md rounded-xl overflow-hidden transition hover:shadow-xl"
              >
                <div className="relative">
                  <img src={imageArray[index % imageArray.length]} alt="Event" className="w-full h-48 object-cover" />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
                    <span className="text-sm font-semibold text-purple-800">{formatDate(event.date)}</span>
                  </div>
                 
                </div>
                
                <div className="p-5">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">{event.event_title}</h2>
                  <p className="text-gray-600 text-sm mb-2">
                    <span className="inline-block w-5 mr-2">🕒</span> {event.time_slot}
                  </p>
                  
                  {/* Enrollment Stats */}
                  <div className="mt-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Enrollment Status</span>
                      <span className="text-sm font-semibold text-purple-800">
                        {event.slots_booked} / {totalSeats} seats filled
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="h-2.5 rounded-full transition-all duration-500 ease-out"
                        style={{ 
                          width: `${enrollmentPercentage}%`,
                          backgroundColor: isFull ? '#ef4444' : 
                                          enrollmentPercentage > 80 ? '#f97316' : '#8b5cf6'
                        }}
                      ></div>
                    </div>
                    
                    {/* Enrollment Status Text */}
                    <div className="mt-1 text-xs text-right">
                      {isFull ? (
                        <span className="text-red-500 font-medium">No slots available</span>
                      ) : enrollmentPercentage >= 90 ? (
                        <span className="text-red-500 font-medium">Almost full!</span>
                      ) : enrollmentPercentage >= 70 ? (
                        <span className="text-orange-500 font-medium">Filling up quickly</span>
                      ) : (
                        <span className="text-green-600 font-medium">Spots available</span>
                      )}
                    </div>
                  </div>
             
                  <div className="mt-4">
                    {isFull ? (
                      <button 
                        className="w-full bg-gray-400 text-white py-2.5 px-4 rounded-xl text-sm font-semibold cursor-not-allowed opacity-80 flex items-center justify-center"
                        disabled
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        No more available slots
                      </button>
                    ) : (
                      <button 
                        className="w-full bg-purple-900 hover:bg-purple-700 text-white py-2.5 px-4 rounded-xl text-sm font-semibold transition duration-300 ease-in-out flex items-center justify-center"
                        onClick={() => handleEnroll(event)}
                      >
                        <span>View Details & Enroll</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {enrollmentModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          {/* Modal Container */}
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 relative animate-fadeIn overflow-hidden mx-4">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl transition-colors duration-300"
              onClick={closeModal}
            >
              &times;
            </button>

            {/* Modal Content */}
            <div className="space-y-5">
              {/* Event Title */}
              <h2 className="text-2xl font-bold text-purple-900">{selectedEvent.event_title}</h2>

              {/* Progress Bar in Modal */}
              <div className="mt-2 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Enrollment Status</span>
                  <span className="text-sm font-semibold text-purple-800">
                    {selectedEvent.slots_booked} / {calculateEnrollmentStats(selectedEvent).totalSeats} seats filled
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ 
                      width: `${calculateEnrollmentStats(selectedEvent).enrollmentPercentage}%`,
                      backgroundColor: calculateEnrollmentStats(selectedEvent).isFull ? '#ef4444' : 
                                      calculateEnrollmentStats(selectedEvent).enrollmentPercentage > 80 ? '#f97316' : '#8b5cf6'
                    }}
                  ></div>
                </div>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-2 gap-4 bg-purple-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <p className="text-gray-700"><span className="font-semibold">Date:</span> {formatDate(selectedEvent.date)}</p>
                  <p className="text-gray-700"><span className="font-semibold">Time:</span> {selectedEvent.time_slot}</p>
                  <p className="text-gray-700"><span className="font-semibold">Mode:</span> {selectedEvent.mode_of_joining}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700"><span className="font-semibold">Venue:</span> {selectedEvent.venue}</p>
                  <p className="text-gray-700"><span className="font-semibold">Contact:</span> {selectedEvent.contact_mail}</p>
                  <p className="text-gray-700"><span className="font-semibold">Available:</span> {selectedEvent.available_slots} slots</p>
                </div>
              </div>

              {/* Event Description */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Event Description</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{selectedEvent.description}</p>
              </div>

              {/* Confirm Enrollment Button */}
              {calculateEnrollmentStats(selectedEvent).isFull ? (
                <button
                  className="w-full bg-gray-400 text-white py-3 px-6 rounded-xl font-semibold text-lg transition-colors duration-300 flex items-center justify-center cursor-not-allowed opacity-80"
                  disabled
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  No more available slots
                </button>
              ) : (
                <button
                  className="w-full bg-green-600 hover:bg-green-500 text-white py-3 px-6 rounded-xl font-semibold text-lg transition-colors duration-300 flex items-center justify-center"
                  onClick={() => handleConfirmEnrollment(selectedEvent.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Confirm Enrollment
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllEvents;