// routes/events.js

const express = require('express');
const router = express.Router();
const supabase = require('../supabase/client');

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

module.exports = router;
