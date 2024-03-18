// models/Workout.js
const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateTime: {
    type: Date,
    required: true
  },
  workoutType: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  distance: Number,
  caloriesBurned: Number,
  intensity: Number,
  comments: String
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
