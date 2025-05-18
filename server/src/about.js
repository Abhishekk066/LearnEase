const express = require('express');
const path = require('path');
const aboutUs = express.Router();

aboutUs.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/pages/about-us.html'));
});

module.exports = aboutUs;
