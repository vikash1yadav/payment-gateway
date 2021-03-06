import mongoose from "mongoose";

const OrderSchema = mongoose.Schema({
    isPaid: Boolean,
    amount: Number,
    razorpay: {
        orderId: String,
        paymentId: String,
        signature: String,
    },
});
export const Order = mongoose.model('Order', OrderSchema);
