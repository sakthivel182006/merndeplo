const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Password hashing
dotenv.config();
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;
const mongourl = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(cors());  // Ensure you can handle cross-origin requests

// Mongoose connection to MongoDB
mongoose.connect(mongourl)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.log('MongoDB connection error:', err);
  });

// Define Register schema
const registerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const RegisterModel = mongoose.model('Products', registerSchema);

// POST route for registration
app.post('/api/Products', async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  try {
    // Check if the user already exists
    const existingUser = await RegisterModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered!' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10); // Hashing with salt rounds

    // Create a new user object
    const newUser = new RegisterModel({
      name,
      email,
      password: hashedPassword, // Save the hashed password
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to register user' });
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });
}



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
