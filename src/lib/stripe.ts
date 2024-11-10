import Stripe from 'stripe'

if(!process.env.STRIPE_SECRET_KEY){
  throw new Error('Stripe secret key is not defined')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-10-28.acacia',
  appInfo: {
    name: 'Ignite Shop',
  }
})