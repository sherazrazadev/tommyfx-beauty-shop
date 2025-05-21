  /**
   * Send an order confirmation email using our Express server
   * @param order - Order details
   * @param customer - Customer information
   * @param cartItems - Items in the cart
   * @returns Promise with the response
   */
  // emailClient.ts
  const API_BASE = import.meta.env.VITE_API_URL  // e.g. https://your-api-host.com

  export async function sendOrderConfirmationEmail(order, customer, cartItems) {
    const res = await fetch(`${API_BASE}/api/send-email`, {      // ← relative path here
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order, customer, cartItems }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Email API error (${res.status}): ${text}`);
    }

    return res.json();
  }
