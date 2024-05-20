const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();
const gsheetHelper = require("./gsheet.helper");


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/register_reader', async (req, res) => {
  try {
    const reader = await stripe.terminal.readers.create({
      registration_code: req.body.registration_code,
      label: req.body.label,
      location: req.body.location,
    });
    res.json(reader);
  } catch (err) {
    res.status(402).send(`Error registering reader! ${err.message}`);
  }
});

app.post('/connection_token', async (req, res) => {
  try {
    const token = await stripe.terminal.connectionTokens.create();
    res.json({ secret: token.secret });
  } catch (err) {
    res.status(402).send(`Error creating ConnectionToken! ${err.message}`);
  }
});

app.post('/create_payment_intent', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      payment_method_types: req.body.payment_method_types || ['card_present'],
      capture_method: req.body.capture_method || 'manual',
      amount: req.body.amount,
      currency: req.body.currency || 'usd',
      description: req.body.description || 'Example PaymentIntent',
      payment_method_options: req.body.payment_method_options || [],
      receipt_email: req.body.receipt_email,
    });
    res.json({ intent: paymentIntent.id, secret: paymentIntent.client_secret });
  } catch (err) {
    res.status(402).send(`Error creating PaymentIntent! ${err.message}`);
  }
});

app.post('/capture_payment_intent', async (req, res) => {
  try {
    const paymentIntentId = req.body.payment_intent_id;
    const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);
    res.json({ intent: paymentIntent.id, secret: paymentIntent.client_secret });
  } catch (err) {
    res.status(402).send(`Error capturing PaymentIntent! ${err.message}`);
  }
});

app.post('/cancel_payment_intent', async (req, res) => {
  try {
    const paymentIntentId = req.body.payment_intent_id;
    const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
    res.json({ intent: paymentIntent.id, secret: paymentIntent.client_secret });
  } catch (err) {
    res.status(402).send(`Error canceling PaymentIntent! ${err.message}`);
  }
});

app.post('/create_setup_intent', async (req, res) => {
  try {
    const setupIntent = await stripe.setupIntents.create({
      payment_method_types: req.body.payment_method_types || ['card_present'],
      customer: req.body.customer,
      description: req.body.description,
      on_behalf_of: req.body.on_behalf_of,
    });
    res.json({ intent: setupIntent.id, secret: setupIntent.client_secret });
  } catch (err) {
    res.status(402).send(`Error creating SetupIntent! ${err.message}`);
  }
});

app.post('/attach_payment_method_to_customer', async (req, res) => {
  try {
    const customer = await stripe.customers.retrieve(req.body.customer_id);
    const paymentMethod = await stripe.paymentMethods.attach(req.body.payment_method_id, {
      customer: customer.id,
    });
    res.json(paymentMethod);
  } catch (err) {
    res.status(402).send(`Error attaching PaymentMethod to Customer! ${err.message}`);
  }
});

app.post('/update_payment_intent', async (req, res) => {
  try {
    const paymentIntentId = req.body.payment_intent_id;
    const updateParams = {};
    if (req.body.receipt_email) {
      updateParams.receipt_email = req.body.receipt_email;
    }
    const paymentIntent = await stripe.paymentIntents.update(paymentIntentId, updateParams);
    res.json({ intent: paymentIntent.id, secret: paymentIntent.client_secret });
  } catch (err) {
    res.status(402).send(`Error updating PaymentIntent! ${err.message}`);
  }
});

app.get('/list_locations', async (req, res) => {
  try {
    const locations = await stripe.terminal.locations.list({ limit: 100 });
    res.json(locations.data);
  } catch (err) {
    res.status(402).send(`Error fetching Locations! ${err.message}`);
  }
});

app.post('/create_location', async (req, res) => {
  try {
    const location = await stripe.terminal.locations.create({
      display_name: req.body.display_name,
      address: req.body.address,
    });
    res.json(location);
  } catch (err) {
    res.status(402).send(`Error creating Location! ${err.message}`);
  }
});

  
app.post('/gdata', async (req,res) =>{
  try {
    const email = req.body.email;
    const status = req.body.status;
    const price = req.body.price;
    const quantity = req.body.count;
   
    const sheetId = process.env.DABBA_SALES_GOOGLE_SHEET_ID;
    const tabName = "knox";
    const range = "A:I";

    const googleSheetClient = await gsheetHelper._getGoogleSheetClient();
    console.log()

    const dataToInsert = [];

    dataToInsert.push([
      email,
      price, 
      status,
      quantity,
      new Date().toLocaleString()
    ]);
    
    await gsheetHelper._writeGoogleSheet(googleSheetClient, sheetId, tabName, range, dataToInsert);
    console.log("This is the status", email, price,status)
    res.json({ success: true, message: "Data successfully written to Google Sheet." });
  } catch (error) {
    console.log({
      error_message: error.message,
      error,
    });
    res.status(500).json({ success: false, error: "An error occurred while processing the request." });
  }
});

app.listen(4567, () => {
  console.log('Server listening on port 4567');
});