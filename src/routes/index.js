import {Order} from "../models/order/index"
import express from "express";
import Razorpay from "razorpay"
import CONSTANT_DATA from "../helper/contant";
const { RAZORPAY_KEY_ID, RAZORPAY_SECRET } = CONSTANT_DATA;
// define router
const router = express.Router();
router.get("/test", (req, res) => {
    console.log("hit");
    res.status(200).send({
        data: "This is Payment Gateway index. Use the respective routes to begin.",
    })
});

router.get('/list-orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).send(orders);        
    } catch (error) {
        res.status(500).send({
            message: "something went wrong",
            error
        });
    }

});

// get razorpay-key for access order
router.get('/get-razorpay-key', (req, res) => {
    try {
        res.send({ key: RAZORPAY_KEY_ID });        
    } catch (error) {
        res.status(500).send({
            message: "something went wrong",
            error
        });
    }

});
// create new razorpay payment order 
router.post('/create-order', async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: RAZORPAY_KEY_ID,
            key_secret: RAZORPAY_SECRET,
        });
        const options = {
            amount: req.body.amount,
            currency: 'INR',
        };

        const order = await instance.orders.create(options);
        if (!order) return res.status(500).send('Some error occured');
        res.status(200).send(order);
    } catch (error) {
        res.status(500).send({
            message: "something went wrong",
            error
        });
    }
});

// Save payment details in database
router.post('/pay-order', async (req, res) => {
    try {
        const { amount, razorpayPaymentId, razorpayOrderId, razorpaySignature } =
            req.body;
        const newOrder = Order({
            isPaid: true,
            amount: amount,
            razorpay: {
                orderId: razorpayOrderId,
                paymentId: razorpayPaymentId,
                signature: razorpaySignature,
            },
        });
        await newOrder.save();
        res.send({
            msg: 'Payment was successfull',
        });
    } catch (error) {
        res.status(500).send({
            message: "something went wrong",
            error
        });
    }
});

export default router;