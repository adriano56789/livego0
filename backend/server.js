const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

const DB_PATH = path.join(__dirname, 'database.json');
let db; // In-memory cache of the db

// Function to read the database from file
const readDb = () => {
    try {
        if (fs.existsSync(DB_PATH)) {
            const data = fs.readFileSync(DB_PATH, 'utf8');
            db = JSON.parse(data);
        } else {
            console.log("Database file not found, initializing with default data.");
            const initialDb = require('./db.js');
            db = initialDb;
            fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
        }
    } catch (error) {
        console.error("Could not read or create database file, initializing with default data.", error);
        const initialDb = require('./db.js');
        db = initialDb;
    }
};

// Function to write the database to file
const writeDb = () => {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
    } catch (error) {
        console.error("FATAL: Could not write to database file.", error);
    }
};

// Read DB on server start
readDb();


// Middlewares
app.use(cors());
app.use(express.json());

// --- API ROUTES ---

app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the LiveGo API! Check the README.md for available endpoints.' });
});

// AUTH
app.post('/api/auth/login', (req, res) => {
    const selfUser = db.users['10755083'];
    if (selfUser) {
        res.json(selfUser);
    } else {
        res.status(404).json({ message: 'Main user not found in DB.' });
    }
});

// STREAMS
app.get('/api/streams', (req, res) => {
    const shuffledStreams = [...db.streams].sort(() => Math.random() - 0.5);
    res.json(shuffledStreams);
});

// USERS
app.get('/api/users/:id', (req, res) => {
    const user = db.users[req.params.id];
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found.' });
    }
});

app.get('/api/users/:id/fans', (req, res) => {
    const fanIds = db.followers[req.params.id] || [];
    const fans = fanIds.map(id => db.users[id]).filter(Boolean);
    res.json(fans);
});

app.get('/api/users/:id/following', (req, res) => {
    const followingIds = db.following[req.params.id] || [];
    const following = followingIds.map(id => db.users[id]).filter(Boolean);
    res.json(following);
});

app.get('/api/users/:id/visitors', (req, res) => {
    const visitorIds = db.visitors[req.params.id] || [];
    const visitors = visitorIds.map(id => db.users[id]).filter(Boolean);
    res.json(visitors);
});

// WALLET
app.get('/api/wallet/:userId', (req, res) => {
    const wallet = db.wallet[req.params.userId];
    if (wallet) {
        res.json(wallet);
    } else {
        res.status(404).json({ message: 'Wallet not found for this user.' });
    }
});

// MESSAGES
app.get('/api/messages/:userId', (req, res) => {
    const userConversations = db.conversations[req.params.userId] || {};
    
    const summary = Object.keys(userConversations).map(otherUserId => {
        const otherUser = db.users[otherUserId];
        if (!otherUser) return null;

        const messages = userConversations[otherUserId];
        const lastMessage = messages[messages.length - 1];
        
        return {
            id: otherUserId,
            name: otherUser.name,
            avatar: otherUser.avatarUrl,
            lastMessage: lastMessage ? lastMessage.text : "No messages yet.",
            time: "now", // Simplified for simulation
            age: otherUser.age,
            gender: otherUser.gender,
            level: otherUser.level,
        };
    }).filter(Boolean);

    res.json(summary);
});

app.get('/api/messages/:userId/:chatPartnerId', (req, res) => {
    const { userId, chatPartnerId } = req.params;
    const userConversations = db.conversations[userId] || {};
    const chatHistory = userConversations[chatPartnerId] || [];
    res.json(chatHistory);
});

app.post('/api/messages/:userId/:chatPartnerId', (req, res) => {
    const { userId, chatPartnerId } = req.params;
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ message: 'Message text is required.' });
    }

    const newMessage = {
        id: `msg-${Date.now()}`,
        senderId: userId,
        text,
        timestamp: Date.now()
    };
    
    // Add to both sides of the conversation
    if (!db.conversations[userId]) db.conversations[userId] = {};
    if (!db.conversations[userId][chatPartnerId]) db.conversations[userId][chatPartnerId] = [];
    db.conversations[userId][chatPartnerId].push(newMessage);
    
    if (!db.conversations[chatPartnerId]) db.conversations[chatPartnerId] = {};
    if (!db.conversations[chatPartnerId][userId]) db.conversations[chatPartnerId][userId] = [];
    db.conversations[chatPartnerId][userId].push(newMessage);

    writeDb(); // Persist changes
    
    console.log(`Message from ${userId} to ${chatPartnerId}: ${text}`);
    res.status(201).json({ success: true, message: `Message '${text}' sent.` });
});


// Start the server
app.listen(PORT, () => {
    console.log(`LiveGo backend server running on http://localhost:${PORT}`);
});