import express from 'express';
import sgMail from '@sendgrid/mail';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// SendGrid API key
const apiKey = process.env.SENDGRID_API_KEY;
console.log('API Key (first few chars):', apiKey ? apiKey.substring(0, 5) + '...' : 'Not set');
sgMail.setApiKey(apiKey);

// API route for sending emails
app.post('/api/send-email', async (req, res) => {
  try {
    const { order, customer, cartItems } = req.body;
    
    // Log request data (for debugging)
    console.log('Received order data:', {
      orderId: order.id,
      customerEmail: customer.email,
      itemsCount: cartItems.length
    });
    
    const senderEmail = process.env.SENDER_EMAIL || 'sherazrazadev@gmail.com';
    console.log('Sending email from:', senderEmail);
    
    const msg = {
      to: customer.email,
      from: senderEmail,
      subject: `TommyFX - Order Confirmation #${order.id.substring(0, 8)}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h1>Thank you for your order!</h1>
          <p>Hello ${customer.name}, your order has been confirmed.</p>
          <p>Order #: ${order.id.substring(0, 8)}</p>
        </div>
      `,
    };

    console.log('Attempting to send email to:', customer.email);
    
    const [response] = await sgMail.send(msg);
    console.log('SendGrid Response:', {
      statusCode: response.statusCode,
      headers: response.headers,
    });
    
    console.log('Email sent successfully');
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    
    // More detailed error logging
    if (error.response) {
      console.error('SendGrid Error Response:', {
        statusCode: error.code,
        body: error.response.body,
      });
    }
    
    return res.status(500).json({ 
      message: 'Error sending email', 
      error: error.toString(),
      details: error.response ? error.response.body : null
    });
  }
});

// Test route
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'API server is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});