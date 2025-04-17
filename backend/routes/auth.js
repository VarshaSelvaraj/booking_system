const express = require("express");
const router = express.Router();
const supabase = require("../supabase/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// POST /api/auth/register
router.post("/register", async (req, res) => {
  let { username, email, empId, designation, password } = req.body;

  console.log("Received register data:", req.body);

  if (!username || !email || !empId || !designation || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Normalize username to lowercase
  username = username.toLowerCase();

  try {
    // Check if email already exists
    const { data: existingEmail } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check if lowercase username already exists
    const { data: existingUsername } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .single();

    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const { error: insertError } = await supabase.from("users").insert([
      {
        username, 
        email,
        empid: empId,
        designation,
        password: hashedPassword,
      },
    ]);

    if (insertError) {
      console.error("Supabase insert error:", insertError.message);

      if (insertError.message.includes("users_username_key")) {
        return res.status(400).json({ message: "Username already taken" });
      }

      if (insertError.message.includes("users_email_key")) {
        return res.status(400).json({ message: "Email already exists" });
      }

      return res
        .status(500)
        .json({ message: "Insert failed", error: insertError.message });
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
    // Set cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents JavaScript access (secure against XSS)
      secure: process.env.NODE_ENV === "production", // Set to true in production (HTTPS)
      sameSite: "Strict", // Protects against CSRF
      maxAge: 2 * 60 * 60 * 1000, // 2 hours in ms
    });
    console.log(token);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

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
module.exports = router;
