const { DatabaseUser } = require('./db.js');
const express = require('express');
const path = require('path');
const auth = express.Router();
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

auth.use(cookieParser());
auth.use(express.json());
auth.use('/pages', express.static(path.join(__dirname, '../../client/pages')));

auth.get('/', (req, res) => {
  const username = req.cookies.username;
  if (!username) {
    return res.sendFile(path.join(__dirname, '../../client/pages/index.html'));
  }

  if (username) {
    return res.sendFile(
      path.join(__dirname, '../../client/pages/dashboard.html'),
    );
  }
});

auth.post('/auth', (req, res) => {
  try {
    const username = req.cookies.username;

    if (!username) {
      return res.status(301).json({ auth: false, username });
    }

    if (username) {
      return res.status(200).json({ auth: true, username });
    }
  } catch (error) {
    return res.status(301).json({ auth: false, username });
  }
});

//register users
auth.get('/user/register', (req, res) => {
  const username = req.cookies.username;
  if (!username) {
    return res.sendFile(
      path.join(__dirname, '../../client/pages/register.html'),
    );
  }

  if (username) {
    return res.redirect('/');
  }
});

auth.post('/register', async (req, res) => {
  try {
    const { firstname, lastname, email, mobile, address, password } = req.body;
    const date = new Date().toDateString();
    const time = new Date().toLocaleTimeString('en-IN', { hour12: true });

    const hashPassword = await bcrypt.hash(password, 10);

    const formData = {
      firstname,
      lastname,
      email,
      mobile,
      address,
      password,
      hashPassword,
      date,
      time,
    };

    await new DatabaseUser(formData).save();
    res.status(200).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//login user
auth.get('/user/login', (req, res) => {
  const username = req.cookies.username;
  if (!username) {
    return res.sendFile(path.join(__dirname, '../../client/pages/login.html'));
  }

  if (username) {
    return res.redirect('/');
  }
});

auth.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(301).json({ message: 'Email and Password required.' });
    }

    const databaseData = await DatabaseUser.find({ email });
    if (databaseData.length === 0) {
      return res.status(301).json({ message: 'User not found' });
    }

    const userName = `${databaseData[0].firstname}-${databaseData[0].lastname}`;
    const match = password === databaseData[0].password;

    if (match) {
      res.cookie('username', `${userName}`, { maxAge: 900000, httpOnly: true });
      return res.status(200).json({ message: 'Login sucessfull' });
    }

    res.status(301).json({ message: 'Password is incorrect.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//user logout
auth.get('/user/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/');
});

auth.get('/user', async (req, res) => {
  try {
    const databaseData = await DatabaseUser.find();
    res.status(200).json(databaseData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = auth;
