// api/send-email.ts (Vercel serverless function)
import { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { order, customer, cartItems } = req.body;

    if (!customer?.email || !order?.id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const orderTotal = cartItems.reduce((sum: number, item: any) => 
      sum + (item.price * item.quantity), 0
    );

    const itemsHtml = cartItems.map((item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          ${item.name}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          Rs. ${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `).join('');

    const emailTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Order Confirmation - TommyFX</title>
        </head>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #4F46E5; margin: 0;">Tommy<span style="color: #000;">FX</span></h1>
              <p style="color: #666; margin: 5px 0;">Beauty & Skincare</p>
            </div>
            
            <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
              Order Confirmation
            </h2>
            
            <p>Dear ${customer.name},</p>
            <p>Thank you for your order! We're excited to get your products to you.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #333;">Order Details</h3>
              <p><strong>Order ID:</strong> #${order.id.substring(0, 8)}</p>
              <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background: #4F46E5; color: white;">
                  <th style="padding: 12px; text-align: left;">Product</th>
                  <th style="padding: 12px; text-align: center;">Qty</th>
                  <th style="padding: 12px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
                <tr style="background: #f8f9fa; font-weight: bold;">
                  <td colspan="2" style="padding: 15px; text-align: right;">Total Amount:</td>
                  <td style="padding: 15px; text-align: right; color: #4F46E5;">
                    Rs. ${orderTotal.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #333;">Shipping Address</h3>
              <p style="margin: 5px 0;">${customer.name}</p>
              <p style="margin: 5px 0;">${customer.address}</p>
              <p style="margin: 5px 0;">${customer.city}, ${customer.state} ${customer.zip}</p>
              <p style="margin: 5px 0;">${customer.country}</p>
              <p style="margin: 5px 0;"><strong>Phone:</strong> ${customer.phone}</p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666;">Questions about your order?</p>
              <p style="color: #4F46E5; font-weight: bold;">
                Email: tommyfx.pk@gmail.com | Phone: +92 (306) 714-5010
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const msg = {
      to: customer.email,
      from: process.env.SENDER_EMAIL || 'tommyfx.pk@gmail.com',
      subject: `TommyFX Order Confirmation #${order.id.substring(0, 8)}`,
      html: emailTemplate,
    };

    await sgMail.send(msg);

    res.status(200).json({ 
      success: true, 
      message: 'Order confirmation email sent successfully' 
    });

  } catch (error: any) {
    console.error('Email sending error:', error);
    res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message 
    });
  }
}