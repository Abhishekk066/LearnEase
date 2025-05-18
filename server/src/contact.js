const express = require('express');
const path = require('path');
const contact = express.Router();

contact.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/pages/contact.html'));
});

module.exports = contact;
