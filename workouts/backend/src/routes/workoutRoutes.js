// src/routes/workoutRoutes.js
import express from 'express';
import { 
  getAllWorkouts, 
  getWorkoutById, 
  createWorkout,
  updateWorkout,
  deleteWorkout
} from '../controllers/workoutController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

router.use(requireAuth); // Alle routes vereisen authenticatie

// GET alle workouts
router.get('/', getAllWorkouts);

// GET één workout
router.get('/:id', getWorkoutById);

// POST nieuwe workout
router.post('/', createWorkout);

// PATCH workout (aanpassen)
router.patch('/:id', updateWorkout);

// DELETE workout
router.delete('/:id', deleteWorkout);

export default router;