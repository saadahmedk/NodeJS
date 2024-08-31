// routes/activity.js
const express = require('express');
const { sql, poolPromise } = require('../config/connectivity');
const Activity = require('../model/Activity'); // Assuming you have an Activity model defined
const { body, validationResult } = require('express-validator');


const route = express.Router();


route.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Activity');
        const activities = result.recordset.map(
            record => new Activity(record.Id, record.Name, record.Description, record.Code,record.Active)
        );
        res.json(activities);
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Server Error');
    }
});

route.post('/', [
    body('Name').isString(),
    body('Description').isString(),
    body('Code').isString(),
    body('Active').isBoolean()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { Name, Description, Code, Active } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Name', sql.NVarChar, Name)
            .input('Description', sql.NVarChar, Description)
            .input('Code', sql.NVarChar, Code)
            .input('Active', sql.Bit, Active)
            .query('INSERT INTO Activity (Name, Description, Code, Active, FeatureId) VALUES (@Name, @Description, @Code, @Active, 34); SELECT SCOPE_IDENTITY() AS id;');

        res.status(201).json({ message: 'Activity created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = route;