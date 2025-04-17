import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import addMonths from "date-fns/addMonths";
import subMonths from "date-fns/subMonths";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import enUS from "date-fns/locale/en-US";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const customStyles = `
  /* Main calendar container */
  .rbc-calendar {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  /* Header styling */
  .rbc-toolbar {
    padding: 12px;
    color: #4a4a4a;
  }
  
  /* Month view header */
  .rbc-month-header {
    background-color: #f8f6ff;
  }
  
  .rbc-header {
    padding: 10px 0;
    font-weight: 600;
    color: #6b46c1;
  }
  
  /* Date cells */
  .rbc-date-cell {
    padding: 4px 5px;
    color: #444;
  }
  
  .rbc-off-range-bg {
    background-color: #f8f6ff;
  }
  
  .rbc-today {
    background-color: #e6e1f9;
  }
  
  /* Event styling */
  .rbc-event {
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
  }
  
  .rbc-event:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  /* Custom event classes */
  .event-important {
    background: linear-gradient(135deg, #ff6b6b, #f15a5a) !important;
  }
  
  .event-personal {
    background: linear-gradient(135deg, #5ad8a6, #42c78a) !important;
  }
  
  /* Default event */
  .event-default {
    background: linear-gradient(135deg, #9f7aea, #805ad5) !important;
  }
  
  /* Custom tooltip */
  .event-tooltip {
    background-color: white;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(107, 70, 193, 0.2);
    border-left: 4px solid #9f7aea;
    padding: 10px;
    max-width: 300px;
    z-index: 1000;
  }
  
  /* Custom toolbar buttons */
  .custom-toolbar-btn {
    background: linear-gradient(135deg,rgb(193, 169, 240),rgb(160, 154, 178));
    color: white;
    border: none;
    transition: all 0.3s ease;
  }
  
  .custom-toolbar-btn:hover {
    background: linear-gradient(135deg, #805ad5, #6b46c1);
    transform: translateY(-1px);
  }
  
  /* Month dropdown */
  .month-dropdown {
    border-left: 3px solid #9f7aea;
  }
  
  /* Loading animation */
  .loading-spinner {
    border-top-color: #9f7aea;
    border-right-color: #9f7aea;
  }
`;

const Schedule = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState(Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.type = "text/css";
    styleElement.appendChild(document.createTextNode(customStyles));
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/events/my-bookings`,
          {
            withCredentials: true,
          }
        );

        const calendarEvents = res.data
          .map((booking) => {
            try {
              const startTime = booking.events.time_slot.split(" - ")[0];
              const endTime =
                booking.events.time_slot.split(" - ")[1] ||
                format(
                  new Date(
                    new Date(`${booking.events.date} ${startTime}`).getTime() +
                      60 * 60 * 1000
                  ),
                  "h:mm a"
                );

              const eventStart = new Date(
                `${booking.events.date} ${startTime}`
              );
              const eventEnd = endTime
                ? new Date(`${booking.events.date} ${endTime}`)
                : new Date(eventStart.getTime() + 60 * 60 * 1000);

              return {
                id: booking.id || booking._id,
                title: booking.events.event_title,
                start: eventStart,
                end: eventEnd,
                resource: booking.events.description || "",
                location: booking.events.location || "",
                className: booking.events.event_type
                  ? `event-${booking.events.event_type.toLowerCase()}`
                  : "event-default",
              };
            } catch (err) {
              console.error("Error parsing event data:", err, booking);
              return null;
            }
          })
          .filter((event) => event !== null);

        setEvents(calendarEvents);
        setError(null);
      } catch (error) {
        console.error("Error fetching calendar data:", error);
        setError("Failed to load your bookings. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const eventStyleGetter = (event) => {
    return {
      className: event.className || "event-default",
    };
  };

  // mouse events for custom tooltips
  const handleEventMouseEnter = (event, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredEvent(event);
    setTooltipPosition({
      top: rect.bottom + window.scrollY + 10,
      left: rect.left + window.scrollX,
    });
  };

  const handleEventMouseLeave = () => {
    setHoveredEvent(null);
  };

  const MonthSelector = ({ currentDate, onSelectMonth }) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Generate array of months
    const options = [];
    for (let year = currentYear - 1; year <= currentYear + 1; year++) {
      for (let month = 0; month < 12; month++) {
        options.push({ month, year });
      }
    }

    return (
      <div className="relative">
        <div
          className="bg-white border border-gray-300 shadow-lg rounded-md p-2 absolute z-10 mt-1 w-64 max-h-64 overflow-y-auto month-dropdown"
          style={{ top: "100%", left: "50%", transform: "translateX(-50%)" }}
        >
          {options.map((option, index) => (
            <div
              key={index}
              className={`p-2 cursor-pointer hover:bg-purple-100 rounded ${
                option.month === currentMonth && option.year === currentYear
                  ? "bg-purple-200"
                  : ""
              }`}
              onClick={() => {
                onSelectMonth(new Date(option.year, option.month, 1));
                setShowMonthDropdown(false);
              }}
            >
              {months[option.month]} {option.year}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Custom toolbar component
  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      const newDate = subMonths(toolbar.date, 1);
      toolbar.onNavigate("DATE", newDate);
      setCurrentDate(newDate);
    };

    const goToNext = () => {
      const newDate = addMonths(toolbar.date, 1);
      toolbar.onNavigate("DATE", newDate);
      setCurrentDate(newDate);
    };

    const goToCurrent = () => {
      const today = new Date();
      toolbar.onNavigate("TODAY");
      setCurrentDate(today);
    };

    const toggleMonthDropdown = () => {
      setShowMonthDropdown(!showMonthDropdown);
    };

    const onSelectMonth = (date) => {
      toolbar.onNavigate("DATE", date);
      setCurrentDate(date);
    };

    return (
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <div className="flex">
          <button
            className="custom-toolbar-btn py-2 px-4 rounded-l mr-1 font-semibold"
            onClick={goToCurrent}
          >
            Today
          </button>
          <button
            className="custom-toolbar-btn py-2 px-4 mr-1 font-semibold"
            onClick={goToBack}
            aria-label="Previous Month"
          >
            <span aria-hidden="true">«</span> Prev
          </button>
          <button
            className="custom-toolbar-btn py-2 px-4 rounded-r font-semibold"
            onClick={goToNext}
            aria-label="Next Month"
          >
            Next <span aria-hidden="true">»</span>
          </button>
        </div>

        <div className="relative">
          <button
            className="text-xl font-bold hover:bg-purple-100 py-1 px-3 rounded flex items-center text-purple-800"
            onClick={toggleMonthDropdown}
          >
            {format(toolbar.date, "MMMM yyyy")}
            <svg
              className="w-4 h-4 ml-1 text-purple-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          {showMonthDropdown && (
            <MonthSelector
              currentDate={currentDate}
              onSelectMonth={onSelectMonth}
            />
          )}
        </div>
      </div>
    );
  };

  const EventComponent = ({ event }) => (
    <div
      className="text-xs overflow-hidden"
      onMouseEnter={(e) => handleEventMouseEnter(event, e)}
      onMouseLeave={handleEventMouseLeave}
    >
      <strong className="block truncate">{event.title}</strong>
      {view !== Views.MONTH && event.location && (
        <span className="block truncate text-gray-100">
          📍 {event.location}
        </span>
      )}
    </div>
  );
  const CustomTooltip = () => {
    if (!hoveredEvent) return null;

    return (
      <div
        className="event-tooltip"
        style={{
          position: "absolute",
          top: tooltipPosition.top + "px",
          left: tooltipPosition.left + "px",
        }}
      >
        <h3 className="font-bold text-md mb-1 text-violet-400">
          {hoveredEvent.title}
        </h3>
        <p className="mb-1 text-gray-400 font-bold text-sm">
          {format(hoveredEvent.start, "MMMM d, yyyy h:mm a")} -{" "}
          {format(hoveredEvent.end, "h:mm a")}
        </p>
      </div>
    );
  };

  return (
    <div className="p-10 min-h-screen">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 loading-spinner"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button
            className="mt-2 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      ) : (
        <div className=" p-4">
          <Calendar
            localizer={localizer}
            className="p-10"
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
            defaultView={Views.MONTH}
            date={currentDate}
            onNavigate={(date) => setCurrentDate(date)}
            components={{
              toolbar: CustomToolbar,
              event: EventComponent,
            }}
            eventPropGetter={eventStyleGetter}
            popup
            tooltipAccessor={null}
            onView={(newView) => setView(newView)}
            onSelectEvent={(event) => {
              console.log("Event clicked:", event);
            }}
          />
          {hoveredEvent && <CustomTooltip />}
        </div>
      )}
    </div>
  );
};

export default Schedule;
