// src/controllers/orderController.js
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { createMoMoPayment } from "../utils/momo.js";

const FAST_CITIES = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng"];
const EXPRESS_FEE = 30000;
const STANDARD_FEE = 50000;

export const checkoutView = (req, res) => {
  const cart = req.session.cart || [];
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  res.render("checkout", { title: "Thanh toán", cart, subtotal });
};

export const createOrder = async (req, res) => {
  try {
    const cart = req.session.cart || [];
    if (!cart.length) return res.status(400).json({ error: "Giỏ hàng trống" });

    const method = String(req.body.paymentMethod || "COD").toUpperCase();
    const { email, firstName, lastName, city, address, phone } = req.body;

    // 1. Kiểm tra tồn kho
    for (const item of cart) {
      const p = await Product.findById(item.productId).select("stock name");
      if (!p || p.stock < item.qty) {
        return res.status(400).json({ error: `Sản phẩm "${p?.name || "N/A"}" chỉ còn ${p?.stock || 0} cái.` });
      }
    }

    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const isFast = FAST_CITIES.includes((city || "").trim());
    const shippingFee = isFast ? EXPRESS_FEE : STANDARD_FEE;
    const grandTotal = subtotal + shippingFee;

    // 2. Tạo đơn hàng (Trạng thái chờ thanh toán nếu là MOMO)
    const order = await Order.create({
      user: req.session.user?._id,
      items: cart.map((i) => ({ product: i.productId, qty: i.qty, price: i.price })),
      subtotal,
      shippingFee,
      total: grandTotal,
      shippingMethod: isFast ? "express" : "standard",
      // Nếu MoMo -> pending_payment, Nếu COD -> pending
      status: method === "COD" ? "pending" : "pending_payment",
      payment: { method },
      contactEmail: email,
      shipping: { firstName, lastName, city, address, phone },
    });

    // 3. Xử lý COD
    if (method === "COD") {
      // Trừ kho ngay lập tức
      for (const item of cart) {
        await Product.updateOne({ _id: item.productId }, { $inc: { stock: -item.qty } });
      }
      req.session.cart = [];
      req.io?.emit("order:update", { orderId: String(order._id), status: "pending" });
      return res.json({ success: true, redirect: "/orders" });
    }

    // 4. Xử lý MOMO
    if (method === "MOMO") {
      const momoRes = await createMoMoPayment(String(order._id), grandTotal, `Thanh toán đơn hàng #${order._id}`);
      return res.json({
        success: true,
        payUrl: momoRes.payUrl,
        orderId: String(order._id),
      });
    }
  } catch (err) {
    console.error("[createOrder] ERROR:", err);
    return res.status(500).json({ error: err.message || "Lỗi hệ thống" });
  }
};

// --- XỬ LÝ KHI NGƯỜI DÙNG QUAY VỀ TỪ MOMO ---
export const momoSuccess = async (req, res) => {
  const { orderId, resultCode } = req.query; // MoMo trả về qua URL

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.redirect("/orders");

    // TRƯỜNG HỢP 1: THẤT BẠI HOẶC HỦY (resultCode != 0)
    // Người dùng bấm "Hủy" hoặc tắt tab MoMo quay về
    if (resultCode != "0") {
      // Cập nhật trạng thái thành ĐÃ HỦY để không bị treo đơn
      await Order.findByIdAndUpdate(orderId, {
        status: "cancelled",
        "payment.status": "failed",
      });

      // Không trừ kho, không xóa giỏ hàng (để họ mua lại nếu muốn)
      return res.redirect("/orders");
    }

    // TRƯỜNG HỢP 2: THÀNH CÔNG (resultCode == 0)
    // Kiểm tra để tránh trừ kho 2 lần nếu user refresh trang
    if (order.status === "paid") {
      return res.redirect("/orders");
    }

    // 1. Trừ kho
    for (const item of order.items) {
      await Product.updateOne({ _id: item.product }, { $inc: { stock: -item.qty } });
    }

    // 2. Cập nhật đơn hàng thành ĐÃ THANH TOÁN
    await Order.findByIdAndUpdate(orderId, {
      status: "paid", // Hoặc 'processing' tùy quy trình của bạn
      "payment.status": "success",
      "payment.transactionId": req.query.transId || "", // Lưu mã giao dịch MoMo
      "payment.paidAt": new Date(),
    });

    // 3. Xóa giỏ hàng
    req.session.cart = [];
    req.io?.emit("order:update", { orderId, status: "paid" });

    res.redirect("/orders");
  } catch (err) {
    console.error("MoMo Success Error:", err);
    res.redirect("/orders");
  }
};

export const myOrders = async (req, res) => {
  const orders = await Order.find({ user: req.session.user._id }).sort({ createdAt: -1 }).populate("items.product", "name image price");
  res.render("orders", { title: "Đơn hàng của tôi", orders });
};
