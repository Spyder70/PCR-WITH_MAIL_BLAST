const mysql = require('mysql');
const nodemailer = require('nodemailer');

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pcr3'
});

// Connect to the database
connection.connect();

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
  // Your email service configuration
  service: 'Gmail',
  auth: {
    user: 'varund1357@gmail.com',
    pass: 'mvfx qlmf tkud bpxy'
  }
});

// Fetch recipient data from the database
connection.query('SELECT email,lastName FROM customers ', (error, results) => {
  if (error) {
    console.error(error);
    connection.end(); // Close database connection
    return;
  }

  results.forEach((customers) => {
    const mailOptions = {
      from: 'varund1357@gmail.com',
      to: customers.email,
      subject: 'random',
      html: '<p>Hello ${customers.lastName}, Your personalized message here.</p>'
    };

    // Send email
    transporter.sendMail(mailOptions, (sendError, info) => {
      if (sendError) {
        console.error(sendError);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  });

  connection.end(); // Close database connection
});
