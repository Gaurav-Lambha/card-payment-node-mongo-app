// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/Cardmanagement', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.log('Error connecting to MongoDB:', error));

// Define the schema for the Card
const cardschema = new mongoose.Schema({
  name: String,
  number: Number,
  expiryDate: String
}, { timestamps: true });

// Define the model for the Card
const Card = mongoose.model('Card', cardschema);

// Create Express app
const app = express();

// Enable CORS for all routes
app.use(cors());

// Configure body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define routes
app.post('/api/cards', (req, res) => {
  const { name, number, expiryDate } = req.body;
  const newCard = new Card({ name, number, expiryDate });
  newCard.save()
    .then((data) => res.status(200).json(data))
    .catch(error => res.status(500).send('Error saving Card:', error));
});

app.get('/api/cards', (req, res) => {
  Card.find().sort({ createdAt: 1 })
    .then(cards => res.status(200).json(cards))
    .catch(error => res.status(500).send('Error retrieving cards:', error));
});

app.put('/api/cards/:id', (req, res) => {
  const { id } = req.params;
  const { name, number, expiryDate } = req.body;
  Card.findByIdAndUpdate(id, { name, number, expiryDate }, { new: true })
    .then(Card => res.status(200).json(Card))
    .catch(error => res.status(500).send('Error updating Card:', error));
});

app.delete('/api/cards/:id', (req, res) => {
  const { id } = req.params;
  Card.findByIdAndDelete(id)
    .then((data) => res.status(200).json(data))
    .catch(error => res.status(500).send('Error deleting Card:', error));
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
