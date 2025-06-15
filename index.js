const express = require("express")
const cors = require("cors")
const dbConnection = require("./config/db.config")
const combineRouter = require("./routers/index")
const stripe = require("stripe")("sk_test_51OjJpTASyMRcymO6FVBewDoB2x4Wi5tq5uX5PYSfkAC2pU0sZvWJbZIqGoMTnzEYYFjFh4jbcWYD3OyFc761otRt00tX4j1UO2");

require("dotenv").config()





const app = express()
const port = process.env.PORT || 3002
app.use(express.json())
app.use(cors({ origin: "*" }))
app.use("/api/v1", combineRouter)
dbConnection();

app.post("/create-checkout-session", async (req, res) => {
    try {
        const { amount } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({ amount: amount, currency: "usd", automatic_payment_methods: { enabled: true } });
        console.log(paymentIntent.client_secret)
        res.status(200).send({ clientSecret: paymentIntent.client_secret, });
    }
    catch (error) {
        console.log(error)
    }
});

app.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        // Send success API request
        await fetch(`${process.env.BASE_URL}/transfer/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: session.client_reference_id,
                amount: session.amount_total / 100,
            }),
        });
    }

    res.json({ received: true });
});


app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})
