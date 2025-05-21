import { EmailService } from './emailService';

// Define interfaces for better type safety
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
  country?: string; // Make country optional with ?
}

/**
 * Format cart items for sending in the order confirmation email
 * @param cart - The cart items
 * @returns Formatted items for the email
 */
export const formatOrderItems = (cart: any[]): OrderItem[] => {
  return cart.map(item => ({
    name: item.name,
    quantity: item.quantity,
    price: item.price
  }));
};

/**
 * Send order confirmation email after successful checkout
 * @param order - The order details
 * @param customerInfo - The customer information
 * @param cart - The cart items
 */
export const sendOrderConfirmationEmail = async (
  order: any, 
  customerInfo: CustomerInfo, 
  cart: any[]
): Promise<void> => {
  try {
    // Format the order data for the email
    const formattedOrder: OrderData = {
      id: order.id,
      created_at: order.created_at,
      total_amount: order.total_amount,
      items: formatOrderItems(cart)
    };

    // Format the customer data for the email
    const customer: CustomerInfo = {
      name: customerInfo.name,
      email: customerInfo.email,
      address: customerInfo.address,
      city: customerInfo.city,
      state: customerInfo.state,
      zip: customerInfo.zip,
      country: customerInfo.country || 'Pakistan' // Provide default value here
    };

    // Send the email
    await EmailService.sendOrderConfirmation(formattedOrder, customer);
    console.log('Order confirmation email sent to', customer.email);
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
  }
};