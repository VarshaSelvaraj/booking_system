import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const formatDate = (dateString) => {
    const options = {
      weekday: 'long',
      day: 'numeric', 
      month: 'long', // Full month name (e.g., "April")
      year: 'numeric', // Full year (e.g., "2025")
    };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };
  useEffect(() => {
    const fetchBookings = async () => {
      try {
       
        const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/events/my-bookings`,
          
            {
              withCredentials: true, 
            }
          );
         
        
      
        console.log('Bookings Response:', res.data);
        setBookings(res.data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading bookings...</div>;
  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li key={booking.id} className="border p-4 rounded-lg">
              <h2 className="text-xl font-semibold">{booking.events.event_title}</h2>
              <p>{formatDate(booking.events.date)}</p>
              <p> {booking.events.time_slot}</p>
              <p> {booking.events.venue}</p>
              <p><strong>Booked on </strong> {new Date(booking.booking_date).toLocaleDateString()}</p>
              <button className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
             onClick={() => {
                Swal.fire({
                  title: 'Are you sure you want to cancel this booking?',
                  showDenyButton: true,
                  showCancelButton: true,
                  confirmButtonText: 'Yes, cancel it!',
                  denyButtonText: 'No, keep it',
                  customClass: {
                    actions: 'my-actions',
                    cancelButton: 'order-1 right-gap',
                    confirmButton: 'order-2',
                    denyButton: 'order-3',
                  },
                }).then((result) => {
                  if (result.isConfirmed) {
                    axios.delete(`${import.meta.env.VITE_API_URL}/events/cancel-booking/${booking.booking_id}`, { withCredentials: true })
                      .then((res) => {
                        console.log('Cancellation Response:', res.data);
                        setBookings((prevBookings) => prevBookings.filter((b) => b.booking_id !== booking.booking_id)); // Use booking_id for filtering
                        Swal.fire('Cancelled!', 'Your booking has been cancelled.', 'success');
                      })
                      .catch((err) => {
                        console.error('Cancellation error:', err);
                        Swal.fire('Failed to cancel booking. Please try again later.', '', 'error');
                      });
                  } else if (result.isDenied) {
                    Swal.fire('Your booking is safe!', '', 'info');
                  }
                });
              }}>
                Cancel Booking  
                </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyBookings;