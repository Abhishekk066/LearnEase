const { request } = require('express');
const path = require('path');
const fs = require('fs');

const file = fs.statSync('file.txt');

if (!file) {
  fs.mkdirSync('file.txt');
}
