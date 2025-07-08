require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const puppeteer = require('puppeteer');
const { execSync, spawnSync } = require('child_process');
const { OpenAI } = require('openai');
const { parseQRIS, readQRISFromImage } = require('./qris');
const crypto = require('crypto');

// EXPRESS & SEQUELIZE API SETUP
const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const db = require('./models');
const { handlePhishing } = require('./components/phishing');
const { handleAPK } = require('./components/apk');
const { handleQRIS } = require('./components/qris');
const { handleVirtualNumber } = require('./components/virtual_number');
const { registerApiRoutes } = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API routes
registerApiRoutes(app, db);

// Serve index.html for all non-API routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Configure LLM (OpenAI-compatible)
const openai = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com/v1',
});

const qpanelApiKey = process.env.QPANEL_API_KEY;

// WhatsApp client config
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: puppeteer.executablePath(),
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', qr => {
    console.log('Scan this QR code with WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ WhatsApp client is ready!');
});

const walkSync = (dir, filelist = []) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkSync(fullPath, filelist);
        } else {
            filelist.push(fullPath);
        }
    });
    return filelist;
};

client.on('message', async message => {
    const pesan = message.body.trim();
    // 1. Cek perintah /telp (virtual number)
    if (pesan.startsWith('/telp')) {
        if (await handleVirtualNumber(message, db, axios, openai)) return;
    }
    // 2. Cek perintah /phising (phishing)
    else if (pesan.startsWith('/phising')) {
        if (await handlePhishing(message, db, axios, openai)) return;
    }
    // 3. Cek media: QRIS
    if (await handleQRIS(message, db, readQRISFromImage, openai)) return;
    // 4. Cek media: APK
    if (await handleAPK(message, db, openai)) return;
    // ... tambahkan handler lain jika perlu ...
});

client.initialize();

app.listen(PORT, () => {
    console.log(`🚀 Express API running on http://localhost:${PORT}`);
});
