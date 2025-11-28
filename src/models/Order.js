// src/models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        qty: { type: Number, default: 1 },
        price: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    total: { type: Number, required: true },

    shippingMethod: { type: String, enum: ["express", "standard"], default: "standard" },

    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "completed", "cancelled", "pending_payment"],
      default: "pending",
    },

    payment: {
      method: {
        type: String,
        enum: ["COD", "ZALOPAY", "MOMO", "VNPAY", "STRIPE"],
        default: "COD",
      },
      status: { type: String, default: "pending" },
      transactionId: String,
      amount: Number,
      paidAt: Date,
    },

    contactEmail: String,
    shipping: {
      nation: String,
      firstName: String,
      lastName: String,
      zipCode: String,
      city: String,
      commune: String,
      address: String,
      addressDetail: String,
      phone: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
