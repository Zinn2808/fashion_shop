// src/utils/momo.js
import CryptoJS from "crypto-js";

const PARTNER_CODE = process.env.MOMO_PARTNER_CODE;
const ACCESS_KEY = process.env.MOMO_ACCESS_KEY;
const SECRET_KEY = process.env.MOMO_SECRET_KEY;
const REDIRECT_URL = process.env.MOMO_REDIRECT_URL || "http://localhost:3000/orders/momo/success";
const IPN_URL = process.env.MOMO_IPN_URL || "http://localhost:3000/orders/momo/ipn";
const REQUEST_TYPE = "payWithMethod";

export const createMoMoPayment = async (orderId, amount, orderInfo = "Thanh toán đơn hàng") => {
  const requestId = PARTNER_CODE + Date.now();
  const extraData = "";
  const autoCapture = true;

  const rawSignature = `accessKey=${ACCESS_KEY}&amount=${amount}&extraData=${extraData}&ipnUrl=${IPN_URL}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${PARTNER_CODE}&redirectUrl=${REDIRECT_URL}&requestId=${requestId}&requestType=${REQUEST_TYPE}`;

  const signature = CryptoJS.HmacSHA256(rawSignature, SECRET_KEY).toString(CryptoJS.enc.Hex);

  const body = {
    partnerCode: PARTNER_CODE,
    accessKey: ACCESS_KEY,
    requestId,
    amount: amount.toString(),
    orderId,
    orderInfo,
    redirectUrl: REDIRECT_URL,
    ipnUrl: IPN_URL,
    requestType: REQUEST_TYPE,
    extraData,
    autoCapture,
    lang: "vi",
    signature,
  };

  const response = await fetch("https://test-payment.momo.vn/v2/gateway/api/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (data.payUrl) {
    return { success: true, payUrl: data.payUrl };
  } else {
    throw new Error(data.message || "Lỗi tạo thanh toán MoMo");
  }
};
