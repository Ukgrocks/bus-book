import express from 'express';
import cors from 'cors';
import connectDB from './db.js';
import adminRoutes from './routes/adminRoutes.js';
import adminSignupRoutes from './routes/adminSignup.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your React frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware to parse JSON body
app.use(express.json());


// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/adminadd', adminSignupRoutes);

// Database connection
connectDB().catch(err => {
  console.error('Database connection failed:', err);
  process.exit(1); // Exit if the database connection fails
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
///ENd of lin