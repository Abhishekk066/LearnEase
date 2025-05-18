const express = require('express');
const path = require('path');
const dashboard = express.Router();

dashboard.get('/dashboard', (req, res) => {
  const username = req.cookies.username;
  if (!username) {
    return res.redirect('/user/login');
  }

  if (username) {
    return res.sendFile(
      path.join(__dirname, '../../client/pages/dashboard.html'),
    );
  }
});

module.exports = dashboard;
