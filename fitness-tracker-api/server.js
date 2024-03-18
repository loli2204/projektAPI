// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Workout = require('./models/Workout');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Ange tillåtna ursprung (origins) för CORS
const corsOptions = {
  origin: 'http://localhost:8080', 
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// API-rutter för användare
// Hämta alla användare
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Skapa en ny användare
app.post('/api/users', async (req, res) => {
  const { name, email, password } = req.body;

  const user = new User({
    name,
    email,
    password // Använd lösenordet som det är, utan att hasha det
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Hämta en enskild användare baserat på dess ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Användaren hittades inte' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Uppdatera en enskild användares information baserat på dess ID
app.put('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'Användaren hittades inte' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Ta bort en enskild användare baserat på dess ID
app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Användaren hittades inte' });
    }
    res.json({ message: 'Användaren har tagits bort' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API-rutter för träningspass
// Hämta alla träningspass
app.get('/api/workouts', async (req, res) => {
  try {
    const workouts = await Workout.find();
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Skapa ett nytt träningspass kopplat till en användare
app.post('/api/users/:userId/workouts', async (req, res) => {
  const { userId } = req.params;

  try {
    // Kontrollera om användaren existerar
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Användaren hittades inte' });
    }

    const workout = new Workout({
      userId: userId,
      dateTime: req.body.dateTime,
      workoutType: req.body.workoutType,
      duration: req.body.duration,
      distance: req.body.distance,
      caloriesBurned: req.body.caloriesBurned,
      intensity: req.body.intensity,
      comments: req.body.comments
    });    

    const newWorkout = await workout.save();
    res.status(201).json(newWorkout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Hämta alla träningspass för en specifik användare
app.get('/api/users/:userId/workouts', async (req, res) => {
  const { userId } = req.params;

  try {
    const workouts = await Workout.find({ userId: userId });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Uppdatera ett enskilt träningspass baserat på dess ID
app.put('/api/workouts/:id', async (req, res) => {
  try {
    const workout = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!workout) {
      return res.status(404).json({ message: 'Träningspasset hittades inte' });
    }
    res.json(workout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Ta bort ett enskilt träningspass baserat på dess ID
app.delete('/api/workouts/:id', async (req, res) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: 'Träningspasset hittades inte' });
    }
    res.json({ message: 'Träningspasset har tagits bort' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Logga in användare och generera JWT-token
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Sök efter användaren i databasen baserat på e-postadress
    const user = await User.findOne({ email });

    // Om användaren inte finns, returnera en felmeddelande
    if (!user) {
      return res.status(401).json({ message: 'Fel e-postadress eller lösenord' });
    }

    // Jämför det inkommande lösenordet med det sparade lösenordet
    if (password !== user.password) {
      return res.status(401).json({ message: 'Fel e-postadress eller lösenord' });
    }

    // Generera en JWT-token
    const token = jwt.sign({ userId: user._id }, 'secret_key_here');
    
    // Returnera token och användarens information
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
