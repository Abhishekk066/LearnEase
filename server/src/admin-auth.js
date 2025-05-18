const { DatabaseUser } = require('./db');
const express = require('express');
const adminAuth = express.Router();

adminAuth.get('/admin/user', async (req, res) => {
  try {
    const databaseData = await DatabaseUser.find();
    res.status(200).json(databaseData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = adminAuth;
