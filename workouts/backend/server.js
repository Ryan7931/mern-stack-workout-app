// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import workoutRoutes from './src/routes/workoutRoutes.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173'
}));

const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Workout API draait!' });
});

// Routes
app.use('/api/workouts', workoutRoutes);

// Verbind met MongoDB en start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Verbonden met MongoDB');
    
    // Start server ALLEEN als database gelukt is
    app.listen(PORT, () => {
      console.log(`Server draait op http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database verbinding mislukt:', error.message);
  });