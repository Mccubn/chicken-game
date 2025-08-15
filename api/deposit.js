import Stripe from 'stripe';
import gameDB from '../../lib/db.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { amount, playerId } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Chicken Game Shared Tab',
              description: `Adding $${amount} to the team's shared balance`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/game?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/game?canceled=true`,
      metadata: {
        playerId: playerId || 'anonymous',
        gameType: 'chicken-game',
        amount: amount.toString()
      }
    });

    res.status(200).json({ 
      success: true, 
      url: session.url,
      sessionId: session.id
    });
    
  } catch (error) {
    console.error('Deposit error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 