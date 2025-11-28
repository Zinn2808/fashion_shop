// src/public/js/app.js
console.log("Đã tải file app.js");

// Hàm hỗ trợ: Định dạng ngày giờ theo múi giờ Việt Nam
function formatDateTimeVN() {
  const d = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
  });
  const date = new Date(d);
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const DD = String(date.getDate()).padStart(2, "0");
  const YYYY = date.getFullYear();
  let h = date.getHours();
  const ampm = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${MM}/${DD}/${YYYY} ${h}:${mm}${ampm}`;
}

// ------------------------------ Khởi tạo chính khi tải trang ------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // 1. Hiển thị thời gian
  const timeEl = document.getElementById("time-now");
  if (timeEl) timeEl.textContent = formatDateTimeVN();

  // 2. Logic Thanh toán & Phí vận chuyển
  const checkoutForm = document.getElementById("checkoutForm");

  // Chỉ chạy logic thanh toán nếu có form (tránh lỗi ở các trang khác)
  if (checkoutForm) {
    const citySelect = document.getElementById("city");
    const FAST_CITIES = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng"];
    const EXPRESS_FEE = 30000;
    const STANDARD_FEE = 50000;

    // Hàm lấy số nguyên từ chuỗi tiền tệ (vd: "100.000 VNĐ" -> 100000)
    const parseCurrency = (str) => {
      if (!str) return 0;
      return parseInt(str.replace(/[^\d]/g, ""), 10) || 0;
    };

    const calcShipping = () => {
      if (!citySelect) return;

      const city = citySelect.value.trim();
      // Logic phí ship: Nếu thành phố nằm trong list nhanh thì 30k, ngược lại 50k
      const fee = FAST_CITIES.includes(city) ? EXPRESS_FEE : STANDARD_FEE;

      const expressInfo = document.getElementById("Express-Delivery-Info");
      const standardInfo = document.getElementById("Standard-Shipping-Info");
      const shippingCostEl = document.getElementById("shipping-cost");
      const subtotalEl = document.getElementById("subtotal-show");
      const shippingFeeShowEl = document.getElementById("shipping-fee-show");
      const grandTotalEl = document.getElementById("grand-total-show");

      // Ẩn/Hiện thông tin loại hình giao hàng
      if (expressInfo) expressInfo.style.display = fee === EXPRESS_FEE ? "block" : "none";
      if (standardInfo) standardInfo.style.display = fee === STANDARD_FEE ? "block" : "none";
      if (shippingCostEl) shippingCostEl.textContent = fee.toLocaleString() + " VNĐ";

      // Tính tổng tiền
      const subtotal = parseCurrency(subtotalEl ? subtotalEl.textContent : "0");
      const total = subtotal + fee;

      // Cập nhật giao diện
      if (shippingFeeShowEl) shippingFeeShowEl.textContent = fee.toLocaleString() + " VNĐ";
      if (grandTotalEl) grandTotalEl.textContent = total.toLocaleString() + " VNĐ";
    };

    // Chạy 1 lần ngay khi tải trang để hiện phí mặc định
    calcShipping();
    // Gắn sự kiện khi đổi thành phố
    citySelect?.addEventListener("change", calcShipping);

    // 3. Xử lý chuyển đổi phương thức thanh toán (COD / MoMo)
    const paymentOptions = document.querySelectorAll(".payment-option");
    const momoContainer = document.getElementById("momo-button-container");
    const orderBtn = document.getElementById("btn-place-order");

    // Input ẩn lưu phương thức thanh toán (dành cho submit form thường)
    const paymentMethodInput = checkoutForm.querySelector('input[name="paymentMethod"]');

    paymentOptions.forEach((el) => {
      el.addEventListener("click", function () {
        // Đổi giao diện nút được chọn
        paymentOptions.forEach((x) => x.classList.remove("selected"));
        this.classList.add("selected");
        const radio = this.querySelector("input[type='radio']");
        if (radio) radio.checked = true;

        const method = this.dataset.method; // 'cod' hoặc 'momo'

        // Cập nhật value cho input ẩn
        if (paymentMethodInput) paymentMethodInput.value = method.toUpperCase();

        // Ẩn hiện nút Đặt hàng / MoMo tương ứng
        if (method === "momo") {
          if (momoContainer) momoContainer.style.display = "block";
          if (orderBtn) orderBtn.style.display = "none";
        } else {
          if (momoContainer) momoContainer.style.display = "none";
          if (orderBtn) orderBtn.style.display = "block";
        }
      });
    });

    // 4. Xử lý khi bấm nút Thanh toán MoMo
    const momoBtn = document.getElementById("momo-pay-btn");
    momoBtn?.addEventListener("click", async (e) => {
      e.preventDefault(); // Ngăn chặn hành vi submit mặc định của nút

      // Kiểm tra tính hợp lệ của form (required, email, v.v.)
      if (!checkoutForm.checkValidity()) {
        checkoutForm.reportValidity(); // Hiển thị thông báo lỗi của trình duyệt
        return;
      }

      // Chuẩn bị dữ liệu (Chuyển FormData sang JSON để gửi đi dễ hơn)
      const formData = new FormData(checkoutForm);
      const dataObj = Object.fromEntries(formData.entries());

      // Gán cứng phương thức là MOMO
      dataObj.paymentMethod = "MOMO";

      try {
        const res = await fetch("/orders/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataObj),
        });

        const result = await res.json();

        if (result.success && result.payUrl) {
          // Chuyển hướng sang trang thanh toán MoMo
          window.location.href = result.payUrl;
        } else {
          alert(result.error || "Lỗi tạo thanh toán MoMo");
        }
      } catch (err) {
        console.error(err);
        alert("Lỗi kết nối đến server");
      }
    });
  }
});

// ------------------------------ Socket.io (Realtime) ------------------------------
// Kiểm tra xem thư viện socket.io client có tồn tại không
if (typeof io !== "undefined") {
  const socket = io();

  // Lắng nghe sự kiện cập nhật đơn hàng từ server
  socket.on("order:update", (data) => {
    console.log("Đơn hàng cập nhật:", data);
    const { orderId, status } = data;

    const statusEl = document.getElementById(`order-status-${orderId}`);
    if (statusEl) {
      const text = getStatusText(status);
      statusEl.textContent = text;

      // Cập nhật class để đổi màu trạng thái (nếu CSS có hỗ trợ)
      statusEl.className = `status ${status}`;
    }
  });

  // Hàm chuyển đổi mã trạng thái sang tiếng Việt
  function getStatusText(status) {
    const map = {
      pending: "Chờ xác nhận",
      processing: "Đang xử lý",
      shipped: "Đang giao",
      delivered: "Đã giao",
      cancelled: "Đã hủy",
      paid: "Đã thanh toán",
    };
    return map[status] || status;
  }
} else {
  console.warn("Không tìm thấy client Socket.io. Tính năng cập nhật thời gian thực đã tắt.");
}
