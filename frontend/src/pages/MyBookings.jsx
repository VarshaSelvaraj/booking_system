import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  
  const imageArray = [
    "https://th.bing.com/th/id/OIP.YrTWdvURj2_v5oecYF2lywHaEK?rs=1&pid=ImgDetMain",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600",
  ];

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

  // Check if the event is more than 10 hours away
  const isCancellable = (eventDate, timeSlot) => {
    if (!eventDate || !timeSlot) return false;

    const [startTime] = timeSlot.split(' - '); // e.g. "10:00 AM"
    const eventDateTime = new Date(`${eventDate} ${startTime}`);

    const now = new Date();
    const diffInHours = (eventDateTime - now) / (1000 * 60 * 60);

    return diffInHours >= 10;
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/events/my-bookings`, { withCredentials: true });
        console.log('Bookings Response:', res.data);

        if (Array.isArray(res.data)) {
          setBookings(res.data);
        } else {
          setError('Unexpected response format');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/events/cancel-booking/${bookingId}`, {
        withCredentials: true,
      });
      console.log('Cancellation Response:', res.data);

      if (res.data.success) {
        setBookings((prev) => prev.filter((b) => b.booking_id !== bookingId));
        Swal.fire('Cancelled!', 'Your booking has been cancelled.', 'success');
        closeModal();
      } else {
        Swal.fire('Failed to cancel booking. Please try again later.', '', 'error');
      }
    } catch (err) {
      console.error('Cancellation error:', err);
      Swal.fire('Failed to cancel booking. Please try again later.', '', 'error');
    }
  };

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setDetailsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setDetailsModalOpen(false);
  };

  if (loading) return <div className="text-center mt-10">Loading bookings...</div>;
  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-purple-100 to-white overflow-hidden">
      {/* Main Content */}
      <div className={`p-6 shadow-lg transition-all duration-300 ${selectedBooking ? 'blur-sm pointer-events-none select-none' : ''}`}>
        <h1 className="text-3xl font-extrabold mb-8 text-center text-purple-900">My Bookings</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.length === 0 ? (
            <p className="text-center col-span-full text-gray-600">No bookings found.</p>
          ) : (
            bookings.map((booking, index) => {
              const { event_title, date, time_slot, venue } = booking.events;
              const cancellable = isCancellable(date, time_slot);

              return (
                <div
                  key={booking.booking_id}
                  className="bg-white shadow-md rounded-xl overflow-hidden transition hover:shadow-xl"
                >
                  <div className="relative">
                    <img
                      src={imageArray[index % imageArray.length]}
                      alt="Event"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
                      <span className="text-sm font-semibold text-purple-800">{formatDate(date)}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">{event_title}</h2>
                    <p className="text-gray-600 text-sm mb-2">
                      <span className="inline-block w-5 mr-2">🕒</span> {time_slot}
                    </p>
                    <p className="text-gray-600 text-sm mb-2">
                      <span className="inline-block w-5 mr-2">📍</span> {venue}
                    </p>
                    <p className="text-gray-600 text-sm mb-2">
                      <span className="inline-block w-5 mr-2">📅</span> Booked on: {new Date(booking.booking_date).toLocaleDateString()}
                    </p>

                    <div className="flex justify-between gap-2 mt-4">
                      <button
                        className="flex-1 bg-purple-900 hover:bg-purple-700 text-white py-2.5 px-4 rounded-xl text-sm font-semibold transition duration-300 ease-in-out flex items-center justify-center"
                        onClick={() => openModal(booking)}
                      >
                        <span>View Details</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal */}
      {detailsModalOpen && selectedBooking && (
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
              <h2 className="text-2xl font-bold text-purple-900">{selectedBooking.events.event_title}</h2>

              {/* Event Details */}
              <div className="grid grid-cols-2 gap-4 bg-purple-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <p className="text-gray-700"><span className="font-semibold">Date:</span> {formatDate(selectedBooking.events.date)}</p>
                  <p className="text-gray-700"><span className="font-semibold">Time:</span> {selectedBooking.events.time_slot}</p>
                  <p className="text-gray-700"><span className="font-semibold">Mode:</span> {selectedBooking.events.mode_of_joining || 'In-person'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700"><span className="font-semibold">Venue:</span> {selectedBooking.events.venue}</p>
                  <p className="text-gray-700"><span className="font-semibold">Contact:</span> {selectedBooking.events.contact_mail || 'Not provided'}</p>
                  <p className="text-gray-700"><span className="font-semibold">Booked On:</span> {new Date(selectedBooking.booking_date).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Event Description */}
              {selectedBooking.events.description && (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Event Description</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{selectedBooking.events.description}</p>
                </div>
              )}

              {/* Cancel Button */}
              {isCancellable(selectedBooking.events.date, selectedBooking.events.time_slot) ? (
                <button
                  className="w-full bg-red-600 hover:bg-red-500 text-white py-3 px-6 rounded-xl font-semibold text-lg transition-colors duration-300 flex items-center justify-center"
                  onClick={() => {
                    Swal.fire({
                      title: 'Are you sure you want to cancel this booking?',
                      text: 'This action cannot be undone.',
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#d33',
                      cancelButtonColor: '#6b7280',
                      confirmButtonText: 'Yes, cancel it!',
                      cancelButtonText: 'No, keep it'
                    }).then((result) => {
                      if (result.isConfirmed) {
                        handleCancelBooking(selectedBooking.booking_id);
                      }
                    });
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel Booking
                </button>
              ) : (
                <button
                  className="w-full bg-gray-400 text-white py-3 px-6 rounded-xl font-semibold text-lg transition-colors duration-300 flex items-center justify-center cursor-not-allowed opacity-80"
                  disabled
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Cancellation Closed (Less than 10 hours to event)
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;