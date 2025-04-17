// routes/user.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const supabase = require("../supabase/client"); // Adjust the path as needed

router.get("/me", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // Fetch user details from the 'users' table using the email
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(403).json({ message: "Forbidden: Invalid token" });
  }
});

module.exports = router;
