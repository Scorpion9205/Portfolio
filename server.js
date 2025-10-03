const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Handle form submission
app.post('/api/contact', async (req, res) => {
    try {
        console.log('Received contact form submission:', req.body); // Add this line

        const { name, email, subject, message } = req.body;

        // Add validation
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const mailOptions = {
            from: process.env.EMAIL,
            to: 'satyapaltiwari920@gmail.com', // Your email where you want to receive messages
            subject: `Portfolio Contact: ${subject}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong> ${message}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully'); // Add this line
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Server error:', error); // Add this line
        res.status(500).json({ message: 'Error sending email', error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
