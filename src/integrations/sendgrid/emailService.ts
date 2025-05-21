import sgMail from '@sendgrid/mail';

// Initialize SendGrid with your API key
// You should store this in an environment variable
const SENDGRID_API_KEY = import.meta.env.VITE_SENDGRID_API_KEY || 'YOUR_SENDGRID_API_KEY';
sgMail.setApiKey(SENDGRID_API_KEY);

// The email that will appear as the sender
const FROM_EMAIL = 'sherazrazadev@gmail.com';
// Define interfaces for type safety
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderData {
  id: string;
  created_at: string;
  total_amount: number;
  items: OrderItem[];
}

interface CustomerInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
}
/**
 * Email service for sending various types of emails using SendGrid
 */
export class EmailService {
  /**
   * Send an order confirmation email to the customer
   * 
   * @param {object} order - The order details
   * @param {object} customer - The customer details
   * @returns {Promise<any>} - SendGrid response
   */
  static async sendOrderConfirmation(order: any, customer: any) {
    try {
      const orderItems = order.items.map((item: any) => 
        `<tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">$${item.price.toFixed(2)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
      ).join('');

      const msg = {
        to: customer.email,
        from: FROM_EMAIL,
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

      const response = await sgMail.send(msg);
      console.log('Order confirmation email sent successfully');
      return response;
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      throw error;
    }
  }

  /**
   * Send a shipping confirmation email to the customer
   * 
   * @param {object} order - The order details
   * @param {object} customer - The customer details
   * @param {string} trackingNumber - The shipping tracking number
   * @returns {Promise<any>} - SendGrid response
   */
  static async sendShippingConfirmation(order: any, customer: any, trackingNumber: string) {
    try {
      const msg = {
        to: customer.email,
        from: FROM_EMAIL,
        subject: `TommyFX - Your Order #${order.id.substring(0, 8)} Has Shipped!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">Your Order is On Its Way!</h1>
            </div>
            
            <div style="padding: 20px;">
              <p>Hello ${customer.name},</p>
              
              <p>Great news! Your order #${order.id.substring(0, 8)} has been shipped and is on its way to you.</p>
              
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
                <p>You can track your package using the tracking number above.</p>
              </div>
              
              <p>We hope you enjoy your products! If you have any questions, please don't hesitate to contact us.</p>
              
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

      const response = await sgMail.send(msg);
      console.log('Shipping confirmation email sent successfully');
      return response;
    } catch (error) {
      console.error('Error sending shipping confirmation email:', error);
      throw error;
    }
  }

  /**
   * Send a welcome email to new customers
   * 
   * @param {string} email - Customer's email
   * @param {string} name - Customer's name
   * @returns {Promise<any>} - SendGrid response
   */
  static async sendWelcomeEmail(email: string, name: string) {
    try {
      const msg = {
        to: email,
        from: FROM_EMAIL,
        subject: 'Welcome to TommyFX Beauty!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">Welcome to TommyFX Beauty!</h1>
            </div>
            
            <div style="padding: 20px;">
              <p>Hello ${name},</p>
              
              <p>Thank you for creating an account with TommyFX Beauty! We're excited to have you join our community.</p>
              
              <p>At TommyFX, we believe in the power of clean, organic ingredients that enhance your natural beauty. Our products are cruelty-free, environmentally friendly, and designed to make you feel confident in your own skin.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://tommyfx.com/categories" style="background-color: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Shop Now</a>
              </div>
              
              <p>If you have any questions or need assistance, our team is here to help. Just reply to this email or contact our support team.</p>
              
              <p>Happy shopping!</p>
              <p>The TommyFX Team</p>
            </div>
            
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 14px; color: #6b7280;">
              <p>&copy; ${new Date().getFullYear()} TommyFX Beauty. All rights reserved.</p>
              <p>Lahore, Punjab, Pakistan</p>
            </div>
          </div>
        `,
      };

      const response = await sgMail.send(msg);
      console.log('Welcome email sent successfully');
      return response;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }
}