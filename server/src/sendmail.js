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
        pass: '',
      },
    });

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>LearnEase Contact Message</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <div style="background-color: #f5f7fa; padding: 24px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <div style="background-color: #4361ee; padding: 24px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: 0.5px;">LEARNEASE</h1>
          </div>

          <div style="padding: 32px 24px;">
            <h1 style="margin: 0 0 24px; color: #1f2937; font-size: 22px; font-weight: 700;">
              New Message from Contact Form
            </h1>

            <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
              <div style="margin-bottom: 16px;">
                <p style="margin: 0 0 6px; color: #6b7280; font-size: 14px; font-weight: 500;">From</p>
                <p style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 600;">${name}</p>
              </div>

              <div style="margin-bottom: 16px;">
                <p style="margin: 0 0 6px; color: #6b7280; font-size: 14px; font-weight: 500;">Email Address</p>
                <p style="margin: 0; color: #1f2937; font-size: 16px;">${email}</p>
              </div>

              <div>
                <p style="margin: 0 0 6px; color: #6b7280; font-size: 14px; font-weight: 500;">Subject</p>
                <p style="margin: 0; color: #1f2937; font-size: 16px;">${subject}</p>
              </div>
            </div>

            <div style="margin-bottom: 32px;">
              <p style="margin: 0 0 12px; color: #6b7280; font-size: 14px; font-weight: 500;">Message</p>
              <div style="background-color: #f9fafb; border-left: 4px solid #4361ee; border-radius: 6px; padding: 15px; color:#dbdbdb; font-size: 16px; white-space: pre-wrap;">${message.replace(
                /^\n+/,
                '',
              )}</div>
            </div>

            <div style="text-align: center;">
              <p style="font-size: 14px; color: #888;">Reply to: ${email}</p>
            </div>
          </div>

          <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">
              LearnEase Platform — Contact Form Notification
            </p>
            <p style="margin: 0; color: #9ca3af; font-size: 13px;">
              © ${new Date().getFullYear()} LearnEase. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValidEmail(email)) {
      res.json({ message: 'Invalid email.', level: 'error' });
    }
    
    const mailOptions = {
      from: email,
      to: process.env.EMAIL,
      subject: subject,
      html: htmlContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.json({ message: 'Something went wrong.', level: 'error' });
      } else {
        res.json({ message: 'Email sent successfully.', level: 'success' });
      }
    });
  } catch (error) {
    res.json({ message: 'Something went wrong.', level: 'error' });
  }
});

module.exports = sendMail;

