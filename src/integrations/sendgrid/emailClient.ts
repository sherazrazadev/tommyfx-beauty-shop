/**
 * Send an order confirmation email using our Express server
 * @param order - Order details
 * @param customer - Customer information
 * @param cartItems - Items in the cart
 * @returns Promise with the response
 */
export const sendOrderConfirmationEmail = async (
  order: any,
  customer: any,
  cartItems: any[]
) => {
  try {
    const response = await fetch('http://localhost:3000/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order,
        customer,
        cartItems
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send email');
    }
    
    console.log('Order confirmation email sent successfully');
    return data;
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    throw error;
  }
};