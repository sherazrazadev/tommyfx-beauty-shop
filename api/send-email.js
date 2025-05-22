// /api/send-email.js - Vercel Edge Function (Free Plan)
export const config = {
  runtime: 'edge',
}

export default async function handler(req) {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }), 
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await req.json();
    const { order, customer, cartItems } = body;

    // Validation
    if (!customer?.email || !order?.id || !cartItems?.length) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use EmailJS (client-side email service) - more reliable for free plans
    const emailData = {
      to_email: customer.email,
      to_name: customer.name,
      order_id: order.id.substring(0, 8),
      order_date: new Date().toLocaleDateString(),
      customer_name: customer.name,
      customer_phone: customer.phone,
      customer_address: `${customer.address}, ${customer.city}${customer.state ? `, ${customer.state}` : ''}${customer.zip ? ` ${customer.zip}` : ''}, ${customer.country}`,
      order_items: cartItems.map(item => 
        `${item.name} (Qty: ${item.quantity}) - Rs. ${(item.price * item.quantity).toFixed(2)}`
      ).join('\n'),
      order_total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2),
      message: `Order confirmed! Your order #${order.id.substring(0, 8)} has been placed successfully.`
    };

    // Send via EmailJS service (free tier: 200 emails/month)
    const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID || 'service_tommyfx',
        template_id: process.env.EMAILJS_TEMPLATE_ID || 'template_order',
        user_id: process.env.EMAILJS_PUBLIC_KEY || 'your_public_key',
        template_params: emailData
      })
    });

    if (!emailResponse.ok) {
      throw new Error('EmailJS service error');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Order confirmation sent',
        orderId: order.id.substring(0, 8)
      }), 
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Email error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Email service temporarily unavailable',
        details: error.message 
      }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}