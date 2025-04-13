const express = require('express');
const router = express.Router();
const supabase = require('../supabase/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, email, phone, organization, password } = req.body;

  if (!username || !email || !phone || !organization || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Step 1: Check for existing email
    const { data: existingUser, error: fetchError } = await supabase
      .from('registrations')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists. No duplicate email allowed.' });
    }

    // Step 2: Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 3: Insert the new user with hashed password
    const { data, error: insertError } = await supabase
      .from('registrations')
      .insert([{ username, email, phone, organization, password: hashedPassword }]);

    if (insertError) {
      return res.status(500).json({ message: 'Error inserting user', error: insertError.message });
    }

    res.status(201).json({ message: 'User registered successfully', data });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    console.log('Login attempt:', email);
  
    try {
      const { data: user, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('email', email)
        .single();
  
      if (error) {
        console.error('Supabase error:', error.message); // 👈 log DB error
        return res.status(500).json({ message: 'Error fetching user' });
      }
  
      if (!user) {
        console.warn('No user found for email:', email);
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      console.log('User retrieved:', user); // 👈 see full user record
  
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', isMatch); // 👈 show password match result
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '2h',
      });
  
      console.log('JWT created:', token); // 👈 confirm JWT generated
  
      res.json({ token });
    } catch (err) {
      console.error('Login error:', err.message); // 👈 final catch block
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
  
module.exports = router;
