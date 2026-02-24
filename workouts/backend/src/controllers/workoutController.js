import Workout from "../models/Workout.js";
import mongoose from "mongoose";

// GET alle workouts voor de ingelogde gebruiker
// Retourneert alleen workouts waar `userId` overeenkomt met de ingelogde user
export const getAllWorkouts = async (req, res) => {
  try {
    // 1. Haal alle workouts op
    // 2. Sorteer: nieuwste eerst
    const workouts = await Workout.find({ userId: req.user._id })
        .sort({ createdAt: -1 });
    
    // 3. Stuur terug
    res.status(200).json(workouts);
  } catch (error) {
    // 4. Als fout, stuur error
    res.status(500).json({ error: error.message });
  }
};

// GET één workout op basis van ID (openbare lookup)
// Let op: deze route geeft een workout terug zonder owner-check.
// Gebruik deze alleen voor lezen; bewerken/verwijderen vereist owner-checks.
export const getWorkoutById = async (req, res) => {
  // 1. Haal ID uit URL
  const { id } = req.params;

  // 2. Check of ID geldig is (24 tekens, juiste format)
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Ongeldige workout ID' });
  }

  try {
    // 3. Zoek workout met dit ID
    const workout = await Workout.findById(id);

    // 4. Bestaat niet? Stuur 404
    if (!workout) {
      return res.status(404).json({ error: 'Workout niet gevonden' });
    }

    // 5. Gevonden? Stuur terug!
    res.status(200).json(workout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST nieuwe workout — maakt een workout en koppelt deze aan de ingelogde user
export const createWorkout = async (req, res) => {
  // 1. Haal data uit request
  const { title, reps, load } = req.body;

  try {
    // 2. Maak workout in database
    const workout = await Workout.create({ 
      title, reps, load, userId: req.user._id 
    });
    
    // 3. Stuur terug
    res.status(201).json(workout);
  } catch (error) {
    // 4. Validatie fout? (bijv. title vergeten)
    res.status(400).json({ error: error.message });
  }
};

// PATCH workout (aanpassen) — alleen eigenaar kan aanpassen
// We gebruiken een filter met {_id, userId} zodat de backend eigenaar controleert
export const updateWorkout = async (req, res) => {
  const { id } = req.params;

  // Check of ID geldig is
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Ongeldige workout ID' });
  }

  try {
    // Zoek en update in één stap: match op _id EN userId om eigenaar te verzekeren
    const workout = await Workout.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { ...req.body },
      { new: true }
    );

    if (!workout) {
      return res.status(404).json({ error: 'Workout niet gevonden' });
    }

    res.status(200).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE workout (verwijderen) — alleen eigenaar kan verwijderen
// findOneAndDelete zoekt op zowel _id als userId
export const deleteWorkout = async (req, res) => {
  const { id } = req.params;

  // Check of ID geldig is
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Ongeldige workout ID' });
  }

  try {
    // Zoek en verwijder alleen wanneer de ingelogde user de eigenaar is
    const workout = await Workout.findOneAndDelete({ 
      _id: id,
      userId: req.user._id
    });

    if (!workout) {
      return res.status(404).json({ error: 'Workout niet gevonden' });
    }

    res.status(200).json(workout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
