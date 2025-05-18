const express = require('express');
const nodemailer = require('nodemailer');
const sendMail = express.Router();

sendMail.post('/sendmail', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      port: 465,
      auth: {
        user: 'kumarabhishek09142@gmail.com',
        pass: 'iffteymnvfgulxmh',
      },
    });

    const mailOptions = {
      from: 'kumarabhishek09142@gmail.com',
      to: email,
      subject,
      text: `${name}\n\n${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent successfully:', info.response);
      }
    });

    res.json({ message: 'Email sent successfully.' });
  } catch (error) {
    res.json({ message: 'Something went wrong.' });
  }
});

module.exports = sendMail;
