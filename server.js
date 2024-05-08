const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();
app.use(bodyParser.json());


mongoose.connect('mongodb+srv://bajajaditi1122:animal11@cluster0.a4xqbn9.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB Atlas");
}).catch(err => {
    console.error("Error connecting to MongoDB Atlas:", err);
    process.exit(1);
});

const animalSchema = new mongoose.Schema({
    name: String,
    species: String
});

const Animal = mongoose.model('Animal', animalSchema);

// GET all animals
app.get('/animals', async (req, res) => {
    try {
        const animals = await Animal.find();
        res.json(animals);
    } 
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// POST a new animal
app.post('/animals', async (req, res) => {
    try {
        const newAnimal = req.body;
        const animal = new Animal(newAnimal);
        await animal.save();
        res.status(201).json(animal);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT (update) an existing animal
app.put('/animals/:id', async (req, res) => {
    try {
        const animalId = req.params.id;
        const updatedAnimal = req.body;
        await Animal.findByIdAndUpdate(animalId, updatedAnimal);
        res.json(updatedAnimal);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE an animal
app.delete('/animals/:id', async (req, res) => {
    try {
        const animalId = req.params.id;
        await Animal.findByIdAndDelete(animalId);
        res.sendStatus(204);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

