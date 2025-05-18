const express = require('express');
const path = require('path');
const auth = require('./src/auth');
const adminAuth = require('./src/admin-auth');
const dashboard = require('./src/dashboard');
const courses = require('./src/courses');
const aboutUs = require('./src/about');
const contact = require('./src/contact');
const cousesDetails = require('./src/courses-detail');
const chatBot = require('./src/chatbot');
const sendMail = require('./src/sendmail');

const port = 5000;
const app = express();

app.use(express.static(path.join(__dirname, '../client/public')));
app.use('/', auth);
app.use('/', dashboard);
app.use('/', adminAuth);
app.use('/', courses);
app.use('/', aboutUs);
app.use('/', contact);
app.use('/', cousesDetails);
app.use('/', chatBot);
app.use('/', sendMail);
app.use('/admin', express.static(path.join(__dirname, '../admin')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/pages/404.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port http://127.0.0.1:${port}`);
});
