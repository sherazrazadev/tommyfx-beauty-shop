// This is a utility file to set up email sending functionality
// You would need to install the nodemailer package:
// npm install nodemailer

// NOTE: This file would typically be used in a Node.js environment 
// (like a serverless function, API route, or server)
// For client-side usage, you would need to create a backend endpoint

/**
 * To use this in a frontend React application, you should:
 * 1. Create a serverless function (e.g., with Netlify, Vercel, or Supabase Edge Functions)
 * 2. Import and use this utility in that serverless function
 * 3. Call that serverless function from your frontend
 */

interface EmailData {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  replyTo?: string;
}

interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  }
}

// Example configuration for Gmail
const gmailConfig: SMTPConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'your-email@gmail.com', // your Gmail address
    pass: 'your-app-password' // app password (not your regular password)
  }
};

// Example configuration for SendGrid
const sendgridConfig: SMTPConfig = {
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey', // always 'apikey' for SendGrid
    pass: 'your-sendgrid-api-key' // your SendGrid API key
  }
};

// Pick your preferred configuration or create a custom one
const smtpConfig = gmailConfig; // or sendgridConfig, or your custom config

// Initialize nodemailer with your SMTP config
const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    // This should be used in a server-side context, not directly in your React app
    // For demonstration purposes only
    console.log('Sending email with the following data:', emailData);
    console.log('Using SMTP config:', smtpConfig);
    
    // In a real implementation, you would use something like:
    /*
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport(smtpConfig);
    
    const info = await transporter.sendMail({
      from: emailData.from || '"TommyFX Beauty" <noreply@tommyfx.com>',
      to: Array.isArray(emailData.to) ? emailData.to.join(',') : emailData.to,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html,
      replyTo: emailData.replyTo || emailData.from || 'tommyfx.pk@gmail.com'
    });
    
    console.log('Email sent:', info.messageId);
    return true;
    */
    
    return true; // Placeholder for successful email sending
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Function to send email notification when contact form is submitted
export const sendContactFormNotification = async (
  name: string,
  email: string,
  subject: string,
  message: string
): Promise<boolean> => {
  // Email to admin (you)
  const adminEmail = 'tommyfx.pk@gmail.com'; // Replace with your email
  
  // Create email to admin
  const adminEmailData: EmailData = {
    to: adminEmail,
    subject: `New Contact Form Submission: ${subject || 'No Subject'}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-line;">${message}</p>
    `,
    replyTo: email // So you can reply directly to the customer
  };
  
  // Send notification to admin
  return await sendEmail(adminEmailData);
};

// Function to send auto-reply to customer
export const sendCustomerAutoReply = async (
  name: string,
  email: string
): Promise<boolean> => {
  // Create email to customer
  const customerEmailData: EmailData = {
    to: email,
    subject: 'Thank you for contacting TommyFX Beauty',
    html: `
      <h2>Thank you for contacting us!</h2>
      <p>Dear ${name},</p>
      <p>We have received your message and will get back to you as soon as possible.</p>
      <p>In the meantime, feel free to check out our <a href="https://tommyfx.com/categories">product catalog</a>.</p>
      <p>Best regards,</p>
      <p>The TommyFX Beauty Team</p>
    `
  };
  
  // Send auto-reply to customer
  return await sendEmail(customerEmailData);
};

// Function to send a bulk email to multiple recipients
export const sendBulkEmail = async (
  recipients: string[],
  subject: string,
  htmlContent: string
): Promise<boolean> => {
  if (!recipients.length) {
    console.error('No recipients provided');
    return false;
  }
  
  // Create bulk email
  const bulkEmailData: EmailData = {
    to: recipients,
    subject: subject,
    html: htmlContent
  };
  
  // Send bulk email
  return await sendEmail(bulkEmailData);
};

export default {
  sendEmail,
  sendContactFormNotification,
  sendCustomerAutoReply,
  sendBulkEmail
};