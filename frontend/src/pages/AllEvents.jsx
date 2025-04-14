import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
    "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTpD4fWJwjrHDxSSE2IOAKLEHJj6NpoQTWCNP7q6GiAoxmpx8s8"
    
  ]

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/events/getevents`);
        console.log('API Response:', res.data);
        if (Array.isArray(res.data)) {
          setEvents(res.data);
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

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  if (loading) return <div className="text-center mt-10">Loading events...</div>;
  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-purple-100 to-white overflow-hidden">
      {/* Main Content */}
      <div className={`p-6 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg transition-all duration-300 ${selectedEvent ? 'blur-sm pointer-events-none select-none' : ''}`}>
        <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-500">Upcoming Events</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event,index) => (
            <div
              key={event.id}
              className="bg-white  shadow-md rounded-xl overflow-hidden transition hover:shadow-xl"
            >
            
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
                  <button
                    className="flex-1 bg-purple-900 hover:bg-purple-700 text-white py-2 px-4 rounded-xl text-sm"
                    onClick={() => handleViewDetails(event)}
                  >
                    View Details
                  </button>
                  <button className="flex-1 bg-purple-400 hover:bg-purple-700 text-white py-2 px-4 rounded-xl text-sm">
                    Enroll
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-lg p-6 relative animate-fadeIn">
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl"
              onClick={closeModal}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default AllEvents;