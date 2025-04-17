// routes/events.js

const express = require("express");
const router = express.Router();
const supabase = require("../supabase/client");
const authenticateToken = require("../middleware/authMiddleware"); 

// GET /api/events - Fetch all events
router.get("/getevents", async (req, res) => {
  try {
    const { data: events, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("Supabase fetch error:", error.message);
      return res
        .status(500)
        .json({ message: "Failed to fetch events", error: error.message });
    }

    res.status(200).json(events);
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/enroll", async (req, res) => {
  const { eventId } = req.body;
  const userId = req.user.id;

  console.log("Received eventId:", eventId);
  console.log("User ID:", userId);

  try {
    // Step 1: Check if user already enrolled in this event
    const { data: existingBooking, error: existingBookingError } =
      await supabase
        .from("bookings")
        .select("booking_id")
        .eq("event_id", eventId)
        .eq("user_id", userId)
        .eq("booking_status", "Confirmed")
        .single();

    if (existingBooking && !existingBookingError) {
      return res
        .status(400)
        .json({ message: "You are already enrolled in this event" });
    }

    // Step 2: Fetch available slots and slots_booked
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("available_slots, slots_booked")
      .eq("id", eventId)
      .single();

    if (eventError || !eventData) {
      console.error(
        "Event not found:",
        eventError ? eventError.message : "No event data"
      );
      return res.status(404).json({ message: "Event not found" });
    }

    // Step 3: Check if event is fully booked
    if (eventData.slots_booked >= eventData.available_slots) {
      return res
        .status(400)
        .json({ message: "No available slots for this event" });
    }

    // Step 4: Insert booking
    const { data: bookingData, error: bookingError } = await supabase
      .from("bookings")
      .insert([
        {
          event_id: eventId,
          user_id: userId,
          booking_date: new Date().toISOString(),
          booking_status: "Confirmed",
        },
      ]);

    if (bookingError) {
      console.error("Supabase insert error:", bookingError.message);
      return res
        .status(500)
        .json({
          message: "Failed to enroll in event",
          error: bookingError.message,
        });
    }

    // Step 5: Increment slots_booked
    const updatedSlotsBooked = eventData.slots_booked + 1;
    const { error: updateError } = await supabase
      .from("events")
      .update({ slots_booked: updatedSlotsBooked })
      .eq("id", eventId);

    if (updateError) {
      console.error("Failed to update slots_booked:", updateError.message);
      return res
        .status(500)
        .json({
          message: "Failed to update slots_booked",
          error: updateError.message,
        });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Enrollment successful",
        booking: bookingData,
      });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/my-bookings", authenticateToken, async (req, res) => {
  const userId = req.user.id; 
  console.log("User ID:", userId); 
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        booking_id,
        booking_date,
        booking_status,
        events(event_title, date, time_slot, venue, contact_mail)
      `
      ) 
      .eq("user_id", userId)
      .eq("booking_status", "Confirmed"); 

    if (error) {
      console.error("Error fetching bookings:", error.message);
      return res
        .status(500)
        .json({ message: "Failed to fetch bookings", error: error.message });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.delete("/cancel-booking/:id", authenticateToken, async (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user.id;

  console.log("Booking ID:", bookingId);
  console.log("User ID:", userId);

  try {
    // Step 1: Fetch the booking details
    const { data: bookingData, error: bookingError } = await supabase
      .from("bookings")
      .select("event_id, booking_status")
      .eq("booking_id", bookingId)
      .eq("user_id", userId)
      .single();

    if (bookingError || !bookingData) {
      console.error(
        "Booking not found:",
        bookingError ? bookingError.message : "No booking data"
      );
      return res.status(404).json({ message: "Booking not found" });
    }

    // Prevent redundant cancel operations
    if (bookingData.booking_status === "Cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    const eventId = bookingData.event_id;

    // Step 2: Update booking status to 'Cancelled'
    const { error: cancelError } = await supabase
      .from("bookings")
      .update({ booking_status: "Cancelled" })
      .eq("booking_id", bookingId)
      .eq("user_id", userId);

    if (cancelError) {
      console.error("Failed to cancel booking:", cancelError.message);
      return res
        .status(500)
        .json({
          message: "Failed to cancel booking",
          error: cancelError.message,
        });
    }

    // Step 3: Decrement slots_booked in the events table
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("slots_booked")
      .eq("id", eventId)
      .single();

    if (eventError || !eventData) {
      console.error(
        "Event not found:",
        eventError ? eventError.message : "No event data"
      );
      return res.status(404).json({ message: "Event not found" });
    }

    const updatedSlotsBooked = Math.max(0, eventData.slots_booked - 1);
    const { error: updateError } = await supabase
      .from("events")
      .update({ slots_booked: updatedSlotsBooked })
      .eq("id", eventId);

    if (updateError) {
      console.error("Failed to update slots_booked:", updateError.message);
      return res
        .status(500)
        .json({
          message: "Failed to update slots_booked",
          error: updateError.message,
        });
    }

    res
      .status(200)
      .json({ success: true, message: "Booking cancelled successfully" });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
