import Stripe from 'stripe';
import gameDB from '../lib/db.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        
        // Extract the amount from the session
        const amount = session.amount_total / 100; // Convert from cents to dollars
        
        // Update the game balance
        const newBalance = gameDB.updateBalance(amount);
        
        console.log(`Payment successful: $${amount} added to game balance. New balance: $${newBalance}`);
        
        // You could also store transaction history here
        // gameDB.addTransaction({
        //   id: session.id,
        //   amount: amount,
        //   playerId: session.metadata?.playerId,
        //   status: 'completed',
        //   timestamp: new Date().toISOString()
        // });
        
        break;
        
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        break;
        
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
    
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Configure Stripe webhook to send raw body
export const config = {
  api: {
    bodyParser: false,
  },
}; 