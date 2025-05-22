import sgMail from '@sendgrid/mail';

// Set your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { order, customer, cartItems } = req.body;

    // Format order items for email
    const orderItems = cartItems.map(item => 
      `<tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">$${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    ).join('');

    // Create email message
    const msg = {
      to: customer.email,
      from: 'sherazrazadev@gmail.com', // Your verified sender email
      subject: `TommyFX - Order Confirmation #${order.id.substring(0, 8)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Your Order is Confirmed!</h1>
          </div>
          
          <div style="padding: 20px;">
            <p>Hello ${customer.name},</p>
            
            <p>Thank you for your order! We're currently processing it and will send you another email when it ships.</p>
            
            <h2 style="margin-top: 30px;">Order Summary</h2>
            <p><strong>Order Number:</strong> #${order.id.substring(0, 8)}</p>
            <p><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <thead>
                <tr style="background-color: #f3f4f6;">
                  <th style="padding: 10px; text-align: left;">Product</th>
                  <th style="padding: 10px; text-align: left;">Quantity</th>
                  <th style="padding: 10px; text-align: left;">Price</th>
                  <th style="padding: 10px; text-align: left;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${orderItems}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
                  <td style="padding: 10px;"><strong>$${order.total_amount.toFixed(2)}</strong></td>
                </tr>
              </tfoot>
            </table>
            
            <h2 style="margin-top: 30px;">Shipping Address</h2>
            <p>
              ${customer.address}<br>
              ${customer.city}, ${customer.state} ${customer.zip}<br>
              ${customer.country || ''}
            </p>
            
            <div style="margin-top: 40px; padding: 20px; background-color: #f9fafb; border-radius: 5px;">
              <p>If you have any questions about your order, please contact our customer service team at support@tommyfx.com or call us at +92 (306) 714-5010.</p>
            </div>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 14px; color: #6b7280;">
            <p>&copy; ${new Date().getFullYear()} TommyFX Beauty. All rights reserved.</p>
            <p>Lahore, Punjab, Pakistan</p>
          </div>
        </div>
      `,
    };

    // Send the email
    await sgMail.send(msg);

    // Return success response
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Return error response
    return res.status(500).json({ 
      message: 'Error sending email', 
      error: error.toString() 
    });
  }
}