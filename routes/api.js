const express = require('express');

function registerApiRoutes(app, db) {
    app.get('/api/applications', async (req, res) => {
        try {
            const data = await db.application.findAll();
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
    app.get('/api/phisings', async (req, res) => {
        try {
            const data = await db.phising.findAll();
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
    app.get('/api/qris', async (req, res) => {
        try {
            const data = await db.qris.findAll();
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
    app.get('/api/virtual_numbers', async (req, res) => {
        try {
            const data = await db.virtual_number.findAll();
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}

module.exports = { registerApiRoutes }; 