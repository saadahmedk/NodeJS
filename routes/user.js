const express = require('express');
const jwt = require('jsonwebtoken');

const route = express.Router();

const users = [
    { id: 1, username: 'test', password: 'password' }
];
const secretKey = 'debc79e6-fc03-4e52-a1e7-a5142a5673aa';

route.get('/', (req, res) => {
    res.send('User route');
});

route.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if request body contains the necessary fields
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Use jwt.sign to generate the token
        const token = jwt.sign({ id: user.id, username: user.username,password:user.password }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

module.exports = route;
