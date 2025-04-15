// routes/events.js

const express = require('express');
const router = express.Router();
const supabase = require('../supabase/client');
const authenticateToken = require('../middleware/authMiddleware'); // Import the authentication middleware
// Import the authentication middleware

// GET /api/events - Fetch all events
router.get('/getevents', async (req, res) => {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Supabase fetch error:', error.message);
      return res.status(500).json({ message: 'Failed to fetch events', error: error.message });
    }

    res.status(200).json(events);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
router.post('/enroll', async (req, res) => {
  const { eventId } = req.body;
  console.log('Received eventId:', eventId);
  const userId = req.user.id; 
  console.log('User  ID:', userId); // Log the user ID

  try {
    // Step 1: Check available slots for the event
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('available_slots')
      .eq('id', eventId)
      .single(); // Get a single event

    if (eventError || !eventData) {
      console.error('Event not found:', eventError ? eventError.message : 'No event data');
      return res.status(404).json({ message: 'Event not found' });
    }

    // Step 2: Check if there are available slots
    if (eventData.available_slots <= 0) {
      return res.status(400).json({ message: 'No available slots for this event' });
    }

    // Step 3: Insert into the bookings table
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .insert([{ 
        event_id: eventId, 
        user_id: userId,
        booking_date: new Date().toISOString(),
        booking_status: 'Confirmed'
      }]);

    if (bookingError) {
      console.error('Supabase insert error:', bookingError.message);
      return res.status(500).json({ message: 'Failed to enroll in event', error: bookingError.message });
    }

    // Step 4: Update available slots in the events table
    const updatedSlots = eventData.available_slots - 1; // Deduct one slot
    const { error: updateError } = await supabase
      .from('events')
      .update({ available_slots: updatedSlots })
      .eq('id', eventId);

    if (updateError) {
      console.error('Failed to update available slots:', updateError.message);
      return res.status(500).json({ message: 'Failed to update available slots', error: updateError.message });
    }

    res.status(200).json({ success: true, message: 'Enrollment successful', booking: bookingData });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/my-bookings', authenticateToken, async (req, res) => {
  const userId = req.user.id; // Get the user ID from the token
  console.log('User ID:', userId); // Log the user ID
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        booking_id,
        booking_date,
        booking_status,
        events(event_title, date, time_slot, venue)
      `) // Join with events to get event details
      .eq('user_id', userId)
      .eq('booking_status', 'Confirmed') // Only get confirmed bookings;

    if (error) {
      console.error('Error fetching bookings:', error.message);
      return res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.delete('/cancel-booking/:id', authenticateToken, async (req, res) => { 

  const bookingId = req.params.id; // Get the booking ID from the URL parameter 
  console.log('Booking ID:', bookingId); // Log the booking ID
  const userId = req.user.id; // Get the user ID from the token
  console.log('User ID:', userId); // Log the user ID
  try{
    // Step 1: Fetch the booking details
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .select('event_id')
      .eq('booking_id', bookingId)
      .single(); // Get a single booking

    if (bookingError || !bookingData) {
      console.error('Booking not found:', bookingError ? bookingError.message : 'No booking data');
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Step 2: Delete the booking
    const { error: deleteError } =  await supabase
        .from('bookings')
        .update({ booking_status: 'Cancelled' }) // Update the status to 'canceled'
        .eq('booking_id', bookingId)
        .eq('user_id', userId);// Ensure the user ID matches

    if (deleteError) {
      console.error('Failed to delete booking:', deleteError.message);
      return res.status(500).json({ message: 'Failed to cancel booking', error: deleteError.message });
    }

    // Step 3: Update available slots in the events table
    const eventId = bookingData.event_id; // Get the event ID from the booking data
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('available_slots')
      .eq('id', eventId)
      .single(); // Get a single event

    if (eventError || !eventData) {
      console.error('Event not found:', eventError ? eventError.message : 'No event data');
      return res.status(404).json({ message: 'Event not found' });
    }

    const updatedSlots = eventData.available_slots + 1; // Increment available slots
    const { error: updateError } = await supabase
      .from('events')
      .update({ available_slots: updatedSlots })
      .eq('id', eventId);

    if (updateError) {
      console.error('Failed to update available slots:', updateError.message);
      return res.status(500).json({ message: 'Failed to update available slots', error: updateError.message });
    }

    res.status(200).json({ success: true, message: 'Booking canceled successfully' });
  }
  catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}
);

module.exports = router;
