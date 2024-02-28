const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// env config
dotenv.config();


// razorpay config
const instance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
});


const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API's
app.get('/', (req, res) => {
    try {
        return res.status(200).send({ status: true, msg: 'server is up!', result: hash })
    } catch (err) {
        return res.status(500).send({ status: false, msg: 'server error', result: [] });
    }
});

app.post('/acces-key', (req, res) => {
    try {
        if (req.query.name !== 'rahul' && req.query.name !== 'sourabh') return res.status(403).send({ status: false, msg: `You don't have @right to access this API`, result: [] })

        if (req.query.password !== process.env.PASS) return res.status(403).send({ status: false, msg: `please contact to our team!`, result: [] });

        res.status(200).send({ status: true, msg: 'Access Key', result: { key_id: process.env.KEY_ID } })
    } catch (err) {
        return res.status(500).send({ status: false, msg: 'server error', result: [] });
    }
})

app.get('/all-payments', async (req, res) => {
    try {
        //  in feature will fetch the data from UI;
        const response = await instance.payments.all({
            from: '2024-02-18',
            to: '2024-02-27' // we can u currect date
        });

        return res.status(200).send({ status: true, msg: 'All payments List!', result: response })
    } catch (error) {
        return res.status(500).send({ status: false, msg: 'server error', result: [] });
    }
});

app.get('/all-orders', async (req, res) => {
    try {
        //  in feature will fetch the data from UI;
        const response = await instance.orders.all({
            from: '2024-02-17',
            to: '2024-02-18'
        });

        return res.status(200).send({ status: true, msg: 'All orders List!', result: response })
    } catch (error) {
        return res.status(500).send({ status: false, msg: 'server error', result: [] });
    }
});

app.post('/order', async (req, res) => {
    try {
        const options = {
            amount: Number(req.body.amount * 100),  // amount in the smallest currency unit
            currency: req.body.currency,
        };
        const order = await instance.orders.create(options);

        return res.status(200).send({ status: true, msg: 'order created!', result: order });
    } catch (error) {
        return res.status(500).send({ status: false, msg: 'server error', result: [] });
    }
});


app.post('/payment-verification', async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Database comes here
            console.log('payment verification done');
           return res.redirect(`http://localhost:3000/`);
        }else{
            return res.send({ status: false, msg: 'payment failed', result: [] });
        }
    } catch (error) {
        return res.status(500).send({ status: false, msg: 'server error', result: [] });
    }
});



app.listen(process.env.PORT, () => console.log(`server is running on ${process.env.PORT}!`));
