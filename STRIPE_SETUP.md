# 💳 Stripe Integration Setup Guide

## 🎯 **What You Need to Set Up:**

1. **Stripe Account** (free)
2. **API Keys** from Stripe Dashboard
3. **Webhook Endpoint** URL
4. **Environment Variables** in Vercel

## 🚀 **Step-by-Step Setup:**

### **1. Create Stripe Account**
- Go to [stripe.com](https://stripe.com)
- Sign up for a free account
- Complete account verification

### **2. Get Your API Keys**
- In Stripe Dashboard, go to **Developers → API Keys**
- Copy your **Publishable Key** (starts with `pk_`)
- Copy your **Secret Key** (starts with `sk_`)

### **3. Set Up Webhook Endpoint**
- In Stripe Dashboard, go to **Developers → Webhooks**
- Click **"Add endpoint"**
- **Endpoint URL**: `https://your-app-name.vercel.app/api/stripe-webhook`
- **Events to send**: Select these events:
  - `checkout.session.completed`
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
- Copy the **Webhook Signing Secret** (starts with `whsec_`)

### **4. Install Stripe Package**
```bash
npm install stripe
```

### **5. Set Environment Variables in Vercel**
In your Vercel project dashboard, go to **Settings → Environment Variables** and add:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

## 🔗 **Your Stripe Endpoint URLs:**

### **Webhook Endpoint (for Stripe Dashboard):**
```
https://your-app-name.vercel.app/api/stripe-webhook
```

### **Success URL (after payment):**
```
https://your-app-name.vercel.app/game?success=true&session_id={CHECKOUT_SESSION_ID}
```

### **Cancel URL (if payment cancelled):**
```
https://your-app-name.vercel.app/game?canceled=true
```

## 🧪 **Testing:**

### **Test Mode:**
- Use test card numbers from Stripe
- **Test Card**: `4242 4242 4242 4242`
- **Expiry**: Any future date
- **CVC**: Any 3 digits
- **ZIP**: Any 5 digits

### **Test the Flow:**
1. Go to your deployed app
2. Try to add money to shared tab
3. You'll be redirected to Stripe checkout
4. Use test card details
5. Complete payment
6. You'll be redirected back to your app
7. Check Vercel function logs for webhook events

## 🔍 **Troubleshooting:**

### **"Invalid API key" Error:**
- Check your `STRIPE_SECRET_KEY` environment variable
- Ensure you're using the correct key (test vs live)

### **Webhook Not Working:**
- Verify webhook URL is correct
- Check `STRIPE_WEBHOOK_SECRET` environment variable
- Look at Vercel function logs for errors

### **Payment Not Completing:**
- Check Stripe Dashboard for failed payments
- Verify webhook endpoint is accessible
- Test with Stripe's webhook testing tool

## 📱 **How It Works:**

1. **User clicks "Add to Tab"** in your app
2. **Your app calls** `/api/deposit` with amount
3. **Stripe checkout session** is created
4. **User is redirected** to Stripe's payment page
5. **User completes payment** on Stripe
6. **Stripe sends webhook** to your endpoint
7. **Your webhook updates** the game balance
8. **User is redirected back** to your app

## 💡 **Pro Tips:**

- **Start with test mode** before going live
- **Monitor webhook events** in Stripe Dashboard
- **Use Stripe CLI** for local testing
- **Set up error monitoring** for failed payments
- **Test with small amounts** first

## 🎉 **You're Ready!**

Once you've completed these steps:
1. **Deploy your updated code** to Vercel
2. **Test the payment flow** with test cards
3. **Check that webhooks are working** in Stripe Dashboard
4. **Your chicken game will have real payments!** 🐔💰

Need help? Check Stripe's documentation or their support chat! 