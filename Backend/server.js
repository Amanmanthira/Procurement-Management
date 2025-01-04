const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware to handle CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};
app.use(cors(corsOptions));

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Static file serving for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose
  .connect('mongodb+srv://amanmanthira32326:5P6VSXPdvxlyyHEp@cluster0.owvg7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Import product routes
const productRoutes = require('./routes/ProductRoutes');
app.use('/api', productRoutes);
// Import auth routes
const authRoutes = require('./routes/AuthRoutes');
app.use('/api/auth', authRoutes);
const quotationRoutes = require('./routes/quoteRoutes');
app.use('/api/quotes', quotationRoutes);

// Start the server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
