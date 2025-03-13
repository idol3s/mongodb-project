
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(bodyParser.json()); // Obsługa JSON w zapytaniach
app.use(cors());

// Połączenie z MongoDB
mongoose.connect('mongodb://localhost:27017/zoo', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Połączono z bazą MongoDB'))
    .catch(err => console.error('Błąd połączenia z bazą danych:', err));

// Ustawienie plików statycznych (folder public)
app.use(express.static(path.join(__dirname, 'public')));

// Import modeli
const Animal = require('./models/Animal');
const Employee = require('./models/Employee');
const Event = require('./models/Event');
const Souvenir = require('./models/Souvenir');

// CRUD dla Animals
app.post('/animals', async (req, res) => {
    try {
        const newAnimal = new Animal(req.body);
        await newAnimal.save();
        res.status(201).send(newAnimal);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.get('/animals', async (req, res) => {
    try {
        const animals = await Animal.find();
        res.status(200).send(animals);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.put('/animals/:id', async (req, res) => {
    try {
        const currentData = await Animal.findById(req.params.id);
        if (!currentData) return res.status(404).send({ error: 'Zwierzę nie znalezione' });

        const updatedData = {
            name: req.body.name || currentData.name,
            species: req.body.species || currentData.species,
            age: req.body.age || currentData.age,
            description: req.body.description || currentData.description,
            habitat: req.body.habitat || currentData.habitat
        };

        const updatedAnimal = await Animal.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        res.status(200).send(updatedAnimal);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.delete('/animals/:id', async (req, res) => {
    try {
        await Animal.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'Zwierze usunięte!' });
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/animals/search', async (req, res) => {
    try {
        const { field, operator, value } = req.body;

        const operatorsMap = {
            '>': '$gt',
            '<': '$lt',
            '>=': '$gte',
            '<=': '$lte',
            '=': '$eq'
        };

        const query = {};
        query[field] = { [operatorsMap[operator]]: isNaN(value) ? value : Number(value) };
        const animals = await Animal.find(query);
        res.status(200).send(animals);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.put('/animals/:id/health', async (req, res) => {
    try {
        const updatedAnimal = await Animal.findByIdAndUpdate(req.params.id, { healthStatus: req.body.healthStatus }, { new: true });
        res.status(200).send(updatedAnimal);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.get('/animals/:id', async (req, res) => {
    try {
        const animal = await Animal.findById(req.params.id);
        if (!animal) {
            return res.status(404).send({ error: 'Zwierzę nie znalezione' });
        }
        res.status(200).send(animal);
    } catch (err) {
        res.status(500).send({ error: 'Błąd serwera' });
    }
});

// CRUD dla Employees
app.post('/employees', async (req, res) => {
    try {
        const newEmployee = new Employee(req.body);
        await newEmployee.save();
        res.status(201).send(newEmployee);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.get('/employees', async (req, res) => {
    try {
        const employees = await Employee.find().populate('assignedAnimal');
        res.status(200).send(employees);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.put('/employees/:id', async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).send(updatedEmployee);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.delete('/employees/:id', async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'Pracownik usunięty!' });
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/employees/search', async (req, res) => {
    try {
        const { field, value } = req.body;
        const query = {};
        query[field] = value;
        const employees = await Employee.find(query);
        res.status(200).send(employees);
    } catch (err) {
        res.status(500).send(err);
    }
});;

app.get('/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).send({ error: 'Pracownik nie znaleziony' });
        }
        res.status(200).send(employee);
    } catch (err) {
        res.status(500).send({ error: 'Błąd serwera' });
    }
});

// CRUD dla Events
app.post('/events', async (req, res) => {
    try {
        const { title, description, animal, time, durationMinutes, location } = req.body;
        const newEvent = new Event({
            title,
            description,
            animal: parseInt(animal, 10), // Ensure animal ID is an integer
            time,
            durationMinutes,
            location
        });
        await newEvent.save();
        res.status(201).send(newEvent);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.get('/events', async (req, res) => {
    try {
        const events = await Event.find().populate('animal');
        res.status(200).send(events);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.put('/events/:id', async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).send(updatedEvent);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.delete('/events/:id', async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'Wydarzenie usunięte!' });
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/events/search', async (req, res) => {
    try {
        const { field, value } = req.body;
        const query = { [field]:  value  };
        const results = await Event.find(query);
        res.status(200).send(results);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/events/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).send({ error: 'Wydarzenie nie znalezione' });
        }
        res.status(200).send(event);
    } catch (err) {
        res.status(500).send({ error: 'Błąd serwera' });
    }
});

// CRUD dla Souvenirs
app.post('/souvenirs', async (req, res) => {
    try {
        const newSouvenir = new Souvenir(req.body);
        await newSouvenir.save();
        res.status(201).send(newSouvenir);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.get('/souvenirs', async (req, res) => {
    try {
        const souvenirs = await Souvenir.find();
        res.status(200).send(souvenirs);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.put('/souvenirs/:id', async (req, res) => {
    try {
        const updatedSouvenir = await Souvenir.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).send(updatedSouvenir);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.delete('/souvenirs/:id', async (req, res) => {
    try {
        await Souvenir.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'Pamiątka usunięta!' });
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/souvenirs/search', async (req, res) => {
    try {
        const { field, operator, value } = req.body;

        const operatorsMap = {
            '>': '$gt',
            '<': '$lt',
            '>=': '$gte',
            '<=': '$lte',
            '=': '$eq'
        };

        const query = {};

        query[field] = { [operatorsMap[operator]]: isNaN(value) ? value : Number(value) };
        const results = await Souvenir.find(query);
        res.status(200).send(results);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/souvenirs/:id', async (req, res) => {
    try {
        const souvenir = await Souvenir.findById(req.params.id);
        if (!souvenir) {
            return res.status(404).send({ error: 'Pamiątka nie znaleziona' });
        }
        res.status(200).send(souvenir);
    } catch (err) {
        res.status(500).send({ error: 'Błąd serwera' });
    }
});

// Obsługa ścieżki głównej
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});
