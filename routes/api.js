const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../downloads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        cb(null, `web_upload_${timestamp}_${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

function registerApiRoutes(app, db) {
    // Existing GET endpoints
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

    // New POST endpoints for web checking
    app.post('/api/check/phishing', async (req, res) => {
        try {
            const { url } = req.body;
            if (!url) {
                return res.status(400).json({ error: 'URL is required' });
            }

            // Import the phishing handler
            const { handlePhishing } = require('../components/phishing');
            const { OpenAI } = require('openai');
            const axios = require('axios');

            const openai = new OpenAI({
                apiKey: process.env.DEEPSEEK_API_KEY,
                baseURL: 'https://api.deepseek.com/v1',
            });

            // Create a mock message object for the handler
            const mockMessage = {
                body: `/phising ${url}`,
                reply: (text) => {
                    res.json({
                        success: true,
                        result: text,
                        type: 'phishing',
                        url: url
                    });
                }
            };

            await handlePhishing(mockMessage, db, axios, openai);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.post('/api/check/virtual-number', async (req, res) => {
        try {
            const { phoneNumber } = req.body;
            if (!phoneNumber) {
                return res.status(400).json({ error: 'Phone number is required' });
            }

            // Import the virtual number handler
            const { handleVirtualNumber } = require('../components/virtual_number');
            const { OpenAI } = require('openai');
            const axios = require('axios');

            const openai = new OpenAI({
                apiKey: process.env.DEEPSEEK_API_KEY,
                baseURL: 'https://api.deepseek.com/v1',
            });

            // Create a mock message object for the handler
            const mockMessage = {
                body: `/telp ${phoneNumber}`,
                reply: (text) => {
                    res.json({
                        success: true,
                        result: text,
                        type: 'virtual_number',
                        phoneNumber: phoneNumber
                    });
                }
            };

            await handleVirtualNumber(mockMessage, db, axios, openai);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.post('/api/check/qris', upload.single('qrisImage'), async (req, res) => {
        try {
            const { qrisData } = req.body;
            const qrisImage = req.file;

            if (!qrisData && !qrisImage) {
                return res.status(400).json({ error: 'QRIS data or image is required' });
            }

            // Import the QRIS handler
            const { handleQRIS } = require('../components/qris');
            const { readQRISFromImage } = require('../qris');
            const { OpenAI } = require('openai');

            const openai = new OpenAI({
                apiKey: process.env.DEEPSEEK_API_KEY,
                baseURL: 'https://api.deepseek.com/v1',
            });

            // Create a mock message object for the handler
            const mockMessage = {
                body: qrisData || '',
                reply: (text) => {
                    res.json({
                        success: true,
                        result: text,
                        type: 'qris',
                        qrisData: qrisData,
                        hasImage: !!qrisImage
                    });
                }
            };

            // If image is uploaded, process it
            if (qrisImage) {
                mockMessage.body = await readQRISFromImage(qrisImage.path);
            }

            await handleQRIS(mockMessage, db, readQRISFromImage, openai);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.post('/api/check/apk', upload.single('apkFile'), async (req, res) => {
        try {
            const apkFile = req.file;
            if (!apkFile) {
                return res.status(400).json({ error: 'APK file is required' });
            }

            // Import the APK handler
            const { handleAPK } = require('../components/apk');
            const { OpenAI } = require('openai');

            const openai = new OpenAI({
                apiKey: process.env.DEEPSEEK_API_KEY,
                baseURL: 'https://api.deepseek.com/v1',
            });

            // Create a mock message object for the handler
            const mockMessage = {
                body: '',
                reply: (text) => {
                    res.json({
                        success: true,
                        result: text,
                        type: 'apk',
                        fileName: apkFile.originalname
                    });
                }
            };

            // Add the file path to the message
            mockMessage.body = apkFile.path;

            await handleAPK(mockMessage, db, openai);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}

module.exports = { registerApiRoutes }; 