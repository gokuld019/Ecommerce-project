import paypal from '@paypal/checkout-server-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Set up PayPal environment with your credentials
function createPaypalEnvironment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  return new paypal.core.SandboxEnvironment(clientId, clientSecret); // Use LiveEnvironment for production
}

function createPaypalClient() {
  return new paypal.core.PayPalHttpClient(createPaypalEnvironment());
}

export { createPaypalClient };
