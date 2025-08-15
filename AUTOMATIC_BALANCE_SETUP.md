# 🚀 Automatic Balance Updates Setup Guide

## 🎯 **What We Want:**
- ✅ User clicks "🚀 Pay & Add to Tab" button
- ✅ Redirects to your Stripe checkout: `https://buy.stripe.com/fZucN7c9UfHR8wL45P1VK00`
- ✅ User completes payment on Stripe
- ✅ **Balance automatically updates** in your app
- ✅ **No manual input required**

## 🔧 **How to Make This Work:**

### **Step 1: Configure Your Stripe Checkout Link**

In your [Stripe Dashboard](https://dashboard.stripe.com/):

1. **Go to Payment Links** or find your existing checkout link
2. **Edit the checkout link** `https://buy.stripe.com/fZucN7c9UfHR8wL45P1VK00`
3. **Add these settings:**

#### **Success URL:**
```
https://your-app-name.vercel.app/game?success=true&session_id={CHECKOUT_SESSION_ID}
```

#### **Cancel URL:**
```
https://your-app-name.vercel.app/game?canceled=true
```

#### **Webhook Endpoint:**
```
https://your-app-name.vercel.app/api/stripe-webhook
```

### **Step 2: Set Up Environment Variables in Vercel**

In your Vercel project dashboard:

1. Go to **Settings → Environment Variables**
2. Add these variables:

```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### **Step 3: Get Your Stripe Keys**

#### **Secret Key:**
1. In Stripe Dashboard → **Developers → API Keys**
2. Copy your **Secret Key** (starts with `sk_`)

#### **Webhook Secret:**
1. In Stripe Dashboard → **Developers → Webhooks**
2. Click **"Add endpoint"**
3. Enter: `https://your-app-name.vercel.app/api/stripe-webhook`
4. Select events: `checkout.session.completed`
5. Copy the **Webhook Signing Secret** (starts with `whsec_`)

## 🧪 **Testing the Automatic Updates:**

### **Test Flow:**
1. **Click "🚀 Pay & Add to Tab"** in your app
2. **Complete a test payment** on Stripe (use test card: `4242 4242 4242 4242`)
3. **Return to your app** (should redirect automatically)
4. **Check the balance** - it should have increased automatically!
5. **Check Vercel logs** to see the webhook working

### **What Should Happen:**
- ✅ Stripe sends webhook to your app
- ✅ Your webhook receives the payment confirmation
- ✅ Balance updates automatically in the database
- ✅ User sees the new balance immediately

## 🔍 **Troubleshooting:**

### **"Balance not updating automatically"**
- Check if webhook endpoint is accessible
- Verify webhook secret is correct
- Check Vercel function logs for errors
- Ensure Stripe is sending webhooks

### **"Webhook not receiving events"**
- Verify webhook URL is correct
- Check if webhook is enabled in Stripe
- Test with Stripe's webhook testing tool
- Ensure checkout link has webhook configured

### **"Stripe checkout not working"**
- Verify the checkout link URL
- Check if Stripe checkout is enabled
- Test with small amounts first
- Check Stripe dashboard for errors

## 📱 **How It Works Now:**

### **User Experience:**
1. **User sees current balance** in the Payment tab
2. **Clicks "🚀 Pay & Add to Tab"** button
3. **Redirected to Stripe** checkout page
4. **Completes payment** with credit card
5. **Automatically returns** to your app
6. **Balance is updated** automatically
7. **No manual input needed!**

### **Technical Flow:**
1. **Frontend** → Stripe checkout link
2. **Stripe** → Processes payment
3. **Stripe** → Sends webhook to your app
4. **Your webhook** → Receives payment confirmation
5. **Your webhook** → Updates balance in database
6. **Frontend** → Shows updated balance

## 🎯 **Environment Variables Summary:**

### **Required for Automatic Balance Updates:**
```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### **Required for Google Maps:**
```env
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
```

## 💡 **Pro Tips:**

### **For Immediate Setup:**
1. **Configure your Stripe checkout link** with webhook endpoint
2. **Set the environment variables** in Vercel
3. **Test with a small payment** to verify it works
4. **Check Vercel logs** to see webhook events

### **For Production:**
1. **Use live Stripe keys** instead of test keys
2. **Set up proper webhook monitoring** in Stripe
3. **Add error handling** for failed webhooks
4. **Monitor payment success rates**

## 🎉 **What You'll Have:**

### **After Setup:**
- ✅ **Fully automatic balance updates**
- ✅ **Professional payment experience**
- ✅ **Real-time balance tracking**
- ✅ **No manual work required**
- ✅ **Seamless user experience**

### **User Benefits:**
- **One-click payment** process
- **Instant balance updates**
- **Professional checkout experience**
- **No need to remember amounts**

## 🚀 **Next Steps:**

1. **Configure your Stripe checkout link** with webhook settings
2. **Set environment variables** in Vercel
3. **Test the automatic flow** with a small payment
4. **Enjoy automatic balance tracking!** 🎯

Your balance will now update automatically every time someone pays through your Stripe link! 💰✨ 