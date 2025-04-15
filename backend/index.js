const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/user');
const authMiddleware = require('./middleware/authMiddleware'); // Import the authentication middleware
dotenv.config();

const app = express();
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // frontend origin
    credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events',authMiddleware,eventRoutes);
app.use('/api/user',authMiddleware, userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
