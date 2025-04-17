import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const imageArray = [
    "https://th.bing.com/th/id/OIP.YrTWdvURj2_v5oecYF2lywHaEK?rs=1&pid=ImgDetMain",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400",
  ];

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  // Check if the event is more than 10 hours away
  const isCancellable = (eventDate, timeSlot) => {
    if (!eventDate || !timeSlot) return false;

    const [startTime] = timeSlot.split(" - "); // e.g. "10:00 AM"
    const eventDateTime = new Date(`${eventDate} ${startTime}`);

    const now = new Date();
    const diffInHours = (eventDateTime - now) / (1000 * 60 * 60);

    return diffInHours >= 10;
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/events/my-bookings`,
          { withCredentials: true }
        );
        console.log("Bookings Response:", res.data);

        if (Array.isArray(res.data)) {
          setBookings(res.data);
        } else {
          setError("Unexpected response format");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/events/cancel-booking/${bookingId}`,
        {
          withCredentials: true,
        }
      );
      console.log("Cancellation Response:", res.data);

      if (res.data.success) {
        setBookings((prev) => prev.filter((b) => b.booking_id !== bookingId));
        Swal.fire({
          title: "Booking Cancelled",
          text: "Your booking has been successfully cancelled.",
          icon: "success",
          confirmButtonColor: "#8B5CF6",
          background: "#FFFFFF",
          iconColor: "#8B5CF6",
        });
        closeModal();
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to cancel booking. Please try again later.",
          icon: "error",
          confirmButtonColor: "#8B5CF6",
          background: "#FFFFFF",
        });
      }
    } catch (err) {
      console.error("Cancellation error:", err);
      Swal.fire({
        title: "Error",
        text: "Failed to cancel booking. Please try again later.",
        icon: "error",
        confirmButtonColor: "#8B5CF6",
        background: "#FFFFFF",
      });
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

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-violet-200 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-violet-200 rounded mb-2"></div>
          <p className="text-violet-500">Loading bookings...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 p-4 rounded-lg text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );

  return (
    <div className="relative">
      {/* Main Content - using transparent background */}
      <div
        className={`transition-all duration-300 ${
          selectedBooking ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20 p-10">
          {bookings.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center p-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-violet-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-400 text-center">
                No bookings found. Events you book will appear here.
              </p>
              <button
                className="mt-4 px-6 py-2 bg-violet-500 hover:bg-violet-400 text-white rounded-lg transition duration-300 shadow-md"
                onClick={() => (window.location.href = "/dashboard")}
              >
                Browse Events
              </button>
            </div>
          ) : (
            bookings.map((booking, index) => {
              const { event_title, date, time_slot, venue } = booking.events;
              const cancellable = isCancellable(date, time_slot);

              return (
                <div
                  key={booking.booking_id}
                  className="bg-white shadow-md rounded-xl overflow-hidden transition hover:shadow-xl hover:translate-y-[-4px] duration-300"
                >
                  <div className="relative">
                    <img
                      src={imageArray[index % imageArray.length]}
                      alt="Event"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
                      <span className="text-sm font-semibold text-violet-800">
                        {formatDate(date)}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-16"></div>
                  </div>
                  <div className="p-5">
                    <h2 className="text-xl font-bold text-gray-500 mb-3 line-clamp-2">
                      {event_title}
                    </h2>
                    <div className="space-y-2">
                      <p className="text-gray-400 text-sm flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2 text-violet-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {time_slot}
                      </p>
                      <p className="text-gray-400 text-sm flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2 text-violet-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {venue}
                      </p>
                      <p className="text-gray-400 text-sm flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2 text-violet-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Booked:{" "}
                        {new Date(booking.booking_date).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex justify-between gap-2 mt-5">
                      <button
                        className="flex-1 bg-violet-400 hover:bg-violet-700 text-white py-2.5 px-4 rounded-xl text-sm font-semibold transition duration-300 ease-in-out flex items-center justify-center shadow-md"
                        style={{
                          backgroundImage:
                            "linear-gradient(135deg, #b3a0f0, #a77bde)",
                        }}
                        onClick={() => openModal(booking)}
                      >
                        <span>View Details</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
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
              className="absolute top-4 right-4 text-gray-500 hover:text-violet-400 transition-colors duration-300 p-1 rounded-full hover:bg-gray-100"
              onClick={closeModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="space-y-5">
              {/* Event Title */}
              <h2 className="text-2xl font-bold text-violet-900">
                {selectedBooking.events.event_title}
              </h2>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-violet-50 p-5 rounded-xl">
                <div className="space-y-3">
                  <p className="text-gray-700 flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3 text-violet-400 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>
                      <span className="font-medium">Date:</span> <br />
                      {formatDate(selectedBooking.events.date)}
                    </span>
                  </p>
                  <p className="text-gray-700 flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3 text-violet-400 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      <span className="font-medium">Time:</span> <br />
                      {selectedBooking.events.time_slot}
                    </span>
                  </p>
                  <p className="text-gray-700 flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3 text-violet-400 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064"
                      />
                    </svg>
                    <span>
                      <span className="font-medium">Mode:</span> <br />
                      {selectedBooking.events.mode_of_joining || "In-person"}
                    </span>
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-700 flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3 text-violet-400 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>
                      <span className="font-medium">Venue:</span> <br />
                      {selectedBooking.events.venue}
                    </span>
                  </p>
                  <p className="text-gray-700 flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3 text-violet-400 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>
                      <span className="font-medium">Contact:</span> <br />
                      {selectedBooking.events.contact_mail || "Not provided"}
                    </span>
                  </p>
                  <p className="text-gray-700 flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3 text-violet-400 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>
                      <span className="font-medium">Booked On:</span> <br />
                      {new Date(
                        selectedBooking.booking_date
                      ).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>

              {/* Event Description */}
              {selectedBooking.events.description && (
                <div className="bg-white p-5 rounded-xl border border-violet-100 shadow-sm">
                  <h3 className="text-lg font-semibold text-violet-900 mb-3">
                    Event Description
                  </h3>
                  <p className="text-gray-400 whitespace-pre-wrap">
                    {selectedBooking.events.description}
                  </p>
                </div>
              )}

              {/* Cancel Button */}
              {isCancellable(
                selectedBooking.events.date,
                selectedBooking.events.time_slot
              ) ? (
                <button
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #9f7aea, #805ad5)",
                  }}
                  className="w-full text-white py-3 px-6 rounded-xl font-semibold text-lg transition-colors duration-300 flex items-center justify-center shadow-md"
                  onClick={() => {
                    Swal.fire({
                      title: "Cancel Booking?",
                      text: "This action cannot be undone.",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#7C3AED",
                      cancelButtonColor: "#9CA3AF",
                      confirmButtonText: "Yes, cancel it!",
                      cancelButtonText: "No, keep it",
                      background: "#FFFFFF",
                      iconColor: "#7C3AED",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        handleCancelBooking(selectedBooking.booking_id);
                      }
                    });
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancel Booking
                </button>
              ) : (
                <button
                  className="w-full bg-gray-400 text-white py-3 px-6 rounded-xl font-semibold text-lg transition-colors duration-300 flex items-center justify-center cursor-not-allowed opacity-80"
                  disabled
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
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
