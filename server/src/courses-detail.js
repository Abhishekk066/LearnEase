const express = require('express');
const path = require('path');
const coursesDetail = express.Router();

coursesDetail.get('/courses/dev001', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/pages/courses-details.html'));
});

module.exports = coursesDetail;
