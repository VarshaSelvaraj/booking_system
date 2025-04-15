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
          confirmButtonColor: '#8B5CF6',
          background: '#FFFFFF',
          iconColor: '#8B5CF6',
          showConfirmButton: false,
        });
        closeModal();    
      } else {
        Swal.fire({
          icon: "error",
          title: "Enrollment Failed",
          text: "Please try again later.",
          confirmButtonColor: '#8B5CF6',
          background: '#FFFFFF'
        });    
      }
    } catch (err) {   
      console.error('Enrollment error:', err);
      if (err.response?.data?.message === 'You are already enrolled in this event') {
        Swal.fire({
          icon: "info",
          title: "Already Enrolled",
          text: "You have already enrolled in this event.",
          timer: 3000,
          confirmButtonColor: '#8B5CF6',
          background: '#FFFFFF',
          iconColor: '#8B5CF6',
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Enrollment Error",
          text: "An error occurred during enrollment. Please try again later.",
          confirmButtonColor: '#8B5CF6',
          background: '#FFFFFF'
        });
      }
    }
  };

  // Calculate total seats and enrollment percentage
  const calculateEnrollmentStats = (event) => {
    const totalSeats = event.available_slots;
    const enrollmentPercentage = Math.round((event.slots_booked / totalSeats) * 100);
    const isFull = event.slots_booked >= totalSeats;
    return { totalSeats, enrollmentPercentage, isFull };
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-16 h-16 bg-purple-200 rounded-full mb-4"></div>
        <div className="h-4 w-48 bg-purple-200 rounded mb-2"></div>
        <p className="text-purple-500">Loading events...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 p-4 rounded-lg text-center">
      <p className="text-red-600">{error}</p>
    </div>
  );

  return (
    <div className="relative">
      {/* Main Content */}
      <div className={`transition-all duration-300 ${selectedEvent ? 'blur-sm pointer-events-none select-none' : ''}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center p-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600 text-center">No upcoming events found. Check back later for new events.</p>
            </div>
          ) : (
            events.map((event, index) => {
              const { totalSeats, enrollmentPercentage, isFull } = calculateEnrollmentStats(event);
              return (
                <div
                  key={event.id}
                  className="bg-white shadow-md rounded-xl overflow-hidden transition hover:shadow-xl hover:translate-y-[-4px] duration-300"
                >
                  <div className="relative">
                    <img 
                      src={imageArray[index % imageArray.length]} 
                      alt="Event" 
                      className="w-full h-48 object-cover" 
                    />
                    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
                      <span className="text-sm font-semibold text-purple-800">{formatDate(event.date).split(',')[0]}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-16"></div>
                  </div>
                  
                  <div className="p-5">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">{event.event_title}</h2>
                    <div className="space-y-2">
                      <p className="text-gray-600 text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {event.time_slot}
                      </p>
                      <p className="text-gray-600 text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.venue}
                      </p>
                      
                      {/* Enrollment Status */}
                      <div className="mt-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-gray-700">
                            {event.slots_booked} / {totalSeats} seats filled
                          </span>
                          {isFull ? (
                            <span className="text-xs text-red-500 font-medium">No slots available</span>
                          ) : enrollmentPercentage >= 90 ? (
                            <span className="text-xs text-red-500 font-medium">Almost full!</span>
                          ) : enrollmentPercentage >= 70 ? (
                            <span className="text-xs text-orange-500 font-medium">Filling up quickly</span>
                          ) : (
                            <span className="text-xs text-green-600 font-medium">Spots available</span>
                          )}
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ 
                              width: `${enrollmentPercentage}%`,
                              backgroundColor: isFull ? '#ef4444' : 
                                              enrollmentPercentage > 80 ? '#f97316' : '#8b5cf6'
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5">
                      {isFull ? (
                        <button 
                          className="w-full bg-gray-400 text-white py-2.5 px-4 rounded-xl text-sm font-semibold cursor-not-allowed opacity-80 flex items-center justify-center shadow-md"
                          disabled
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          No more available slots
                        </button>
                      ) : (
                        <button 
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 px-4 rounded-xl text-sm font-semibold transition duration-300 ease-in-out flex items-center justify-center shadow-md"
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
            })
          )}
        </div>
      </div>

      {/* Modal */}
      {enrollmentModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          {/* Modal Container */}
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 relative animate-fadeIn overflow-hidden mx-4">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-purple-600 transition-colors duration-300 p-1 rounded-full hover:bg-gray-100"
              onClick={closeModal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-purple-50 p-5 rounded-xl">
                <div className="space-y-3">
                  <p className="text-gray-700 flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-purple-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span><span className="font-medium">Date:</span> <br/>{formatDate(selectedEvent.date)}</span>
                  </p>
                  <p className="text-gray-700 flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-purple-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span><span className="font-medium">Time:</span> <br/>{selectedEvent.time_slot}</span>
                  </p>
                  <p className="text-gray-700 flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-purple-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064" />
                    </svg>
                    <span><span className="font-medium">Mode:</span> <br/>{selectedEvent.mode_of_joining}</span>
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-700 flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-purple-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span><span className="font-medium">Venue:</span> <br/>{selectedEvent.venue}</span>
                  </p>
                  <p className="text-gray-700 flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-purple-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span><span className="font-medium">Contact:</span> <br/>{selectedEvent.contact_mail || 'Not provided'}</span>
                  </p>
                  <p className="text-gray-700 flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-purple-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span><span className="font-medium">Available:</span> <br/>{selectedEvent.available_slots - selectedEvent.slots_booked} of {selectedEvent.available_slots} slots</span>
                  </p>
                </div>
              </div>

              {/* Event Description */}
              {selectedEvent.description && (
                <div className="bg-white p-5 rounded-xl border border-purple-100 shadow-sm">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">Event Description</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{selectedEvent.description}</p>
                </div>
              )}

              {/* Confirm Enrollment Button */}
              {calculateEnrollmentStats(selectedEvent).isFull ? (
                <button
                  className="w-full bg-gray-400 text-white py-3 px-6 rounded-xl font-semibold text-lg transition-colors duration-300 flex items-center justify-center cursor-not-allowed opacity-80 shadow-md"
                  disabled
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  No more available slots
                </button>
              ) : (
                <button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-xl font-semibold text-lg transition-colors duration-300 flex items-center justify-center shadow-md"
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