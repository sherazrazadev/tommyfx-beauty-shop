// /api/send-email.js (Use .js extension for Vercel)
const sgMail = require('@sendgrid/mail');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize SendGrid
    if (!process.env.SENDGRID_API_KEY) {
      return res.status(500).json({ error: 'SENDGRID_API_KEY is not configured' });
    }
    
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const { order, customer, cartItems } = req.body;

    if (!customer?.email || !order?.id || !cartItems) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        received: { 
          hasCustomer: !!customer, 
          hasEmail: !!customer?.email, 
          hasOrder: !!order, 
          hasCartItems: !!cartItems 
        }
      });
    }

    const orderTotal = cartItems.reduce((sum, item) => 
      sum + (parseFloat(item.price) * parseInt(item.quantity)), 0
    );

    const itemsHtml = cartItems.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          ${item.name}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          Rs. ${(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}
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
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #4F46E5; margin: 0; font-size: 32px;">Tommy<span style="color: #000;">FX</span></h1>
              <p style="color: #666; margin: 5px 0; font-size: 14px;">Beauty & Skincare</p>
            </div>
            
            <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px; margin-bottom: 20px;">
              Order Confirmation ✅
            </h2>
            
            <p style="font-size: 16px; line-height: 1.5;">Dear <strong>${customer.name}</strong>,</p>
            <p style="font-size: 16px; line-height: 1.5;">Thank you for your order! We're excited to get your products to you.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4F46E5;">
              <h3 style="margin: 0 0 15px 0; color: #333;">📋 Order Details</h3>
              <p style="margin: 5px 0;"><strong>Order ID:</strong> #${order.id.substring(0, 8)}</p>
              <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
              <p style="margin: 5px 0;"><strong>Payment Method:</strong> Cash on Delivery (COD)</p>
            </div>

            <h3 style="color: #333; margin: 25px 0 15px 0;">🛍️ Order Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
              <thead>
                <tr style="background: #4F46E5; color: white;">
                  <th style="padding: 15px; text-align: left; font-weight: 600;">Product</th>
                  <th style="padding: 15px; text-align: center; font-weight: 600;">Qty</th>
                  <th style="padding: 15px; text-align: right; font-weight: 600;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
                <tr style="background: #f8f9fa; font-weight: bold; border-top: 2px solid #4F46E5;">
                  <td colspan="2" style="padding: 18px; text-align: right; font-size: 16px;">Grand Total:</td>
                  <td style="padding: 18px; text-align: right; color: #4F46E5; font-size: 18px; font-weight: bold;">
                    Rs. ${orderTotal.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #28a745;">
              <h3 style="margin: 0 0 15px 0; color: #333;">🚚 Shipping Address</h3>
              <div style="line-height: 1.6;">
                <p style="margin: 5px 0; font-weight: 600;">${customer.name}</p>
                <p style="margin: 5px 0;">${customer.address}</p>
                <p style="margin: 5px 0;">${customer.city}, ${customer.state} ${customer.zip}</p>
                <p style="margin: 5px 0;">${customer.country}</p>
                <p style="margin: 10px 0 0 0;"><strong>📞 Phone:</strong> ${customer.phone}</p>
              </div>
            </div>

            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
              <h3 style="margin: 0 0 10px 0; color: #1976d2;">📦 What's Next?</h3>
              <p style="margin: 5px 0; line-height: 1.5;">
                Your order is being processed and will be shipped within 2-3 business days.<br>
                You'll receive a tracking notification once your order is dispatched.
              </p>
            </div>

            <div style="text-align: center; margin-top: 40px; padding-top: 25px; border-top: 2px solid #eee;">
              <h3 style="color: #333; margin-bottom: 15px;">Need Help? 💬</h3>
              <p style="color: #666; margin: 5px 0;">Questions about your order?</p>
              <div style="margin: 15px 0;">
                <p style="color: #4F46E5; font-weight: bold; margin: 5px 0;">
                  📧 Email: tommyfx.pk@gmail.com
                </p>
                <p style="color: #4F46E5; font-weight: bold; margin: 5px 0;">
                  📞 Phone: +92 (306) 714-5010
                </p>
              </div>
              <p style="color: #999; font-size: 12px; margin-top: 20px;">
                Thank you for choosing TommyFX Beauty!
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const msg = {
      to: customer.email,
      from: {
        email: process.env.SENDER_EMAIL || 'tommyfx.pk@gmail.com',
        name: 'TommyFX Beauty'
      },
      subject: `✅ Order Confirmed #${order.id.substring(0, 8)} - TommyFX Beauty`,
      html: emailTemplate,
    };

    console.log('Attempting to send email to:', customer.email);
    const result = await sgMail.send(msg);
    console.log('Email sent successfully:', result[0].statusCode);

    return res.status(200).json({ 
      success: true, 
      message: 'Order confirmation email sent successfully',
      orderId: order.id.substring(0, 8)
    });

  } catch (error) {
    console.error('Email sending error:', error);
    
    // Better error handling
    let errorMessage = 'Failed to send email';
    if (error.response) {
      errorMessage = error.response.body?.errors?.[0]?.message || error.message;
    }
    
    return res.status(500).json({ 
      error: errorMessage,
      details: error.message,
      code: error.code || 'UNKNOWN_ERROR'
    });
  }
};