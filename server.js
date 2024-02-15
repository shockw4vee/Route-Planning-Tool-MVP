const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS job_locations (id INTEGER PRIMARY KEY, address TEXT)");
});

app.post('/api/jobLocations', (req, res) => {
    const { address } = req.body;

    if (!address) {
        return res.status(400).json({ error: 'Address is required' });
    }

    db.run('INSERT INTO job_locations (address) VALUES (?)', [address], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.status(201).json({ message: 'Job location added successfully', id: this.lastID });
    });
});

app.get('/api/jobLocations', (req, res) => {
    db.all('SELECT * FROM job_locations', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(rows);
    });
});

app.get('/', (req, res) => {
    res.send('Welcome to the Route Planning Tool MVP!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
