const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const { google } = require('googleapis');

const app = express();
app.use(bodyParser.json());

app.post('/api/send-email', async (req, res) => {
  const { email } = req.body;

  // Send email
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-password'
    }
  });

  let mailOptions = {
    from: 'your-email@gmail.com',
    to: 'your-email@gmail.com',
    subject: 'New Email Submitted',
    text: `Email: ${email}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send('error');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('success');
    }
  });

  // Add to Google Sheet
  const auth = new google.auth.GoogleAuth({
    keyFile: '/path/to/your/service-account-file.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: 'v4', auth: client });
  const spreadsheetId = 'your-spreadsheet-id';

  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: 'Sheet1',
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [[email]]
    }
  });
});

app.listen(5000, () => console.log('Server Running'));
