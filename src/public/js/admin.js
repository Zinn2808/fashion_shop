// src/public/js/admin.js
console.log("admin.js loaded");

// === QUẢN LÝ SẢN PHẨM (nếu có trang /admin/products) ===
document.addEventListener("DOMContentLoaded", function () {
  const imageInput = document.getElementById("image");
  const fileNameSpan = document.getElementById("file-name");
  if (imageInput && fileNameSpan) {
    imageInput.addEventListener("change", function () {
      fileNameSpan.textContent = this.files[0]?.name || "No file chosen";
    });
  }

  // Edit Product
  document.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", function () {
      document.getElementById("productId").value = this.dataset.id;
      document.getElementById("name").value = this.dataset.name;
      document.getElementById("price").value = this.dataset.price;
      document.getElementById("stock").value = this.dataset.stock;
      document.getElementById("category").value = this.dataset.category;
      document.getElementById("colors").value = this.dataset.colors.replace(/\|/g, ", ");
      document.getElementById("sizes").value = this.dataset.sizes.replace(/\|/g, ", ");
      document.getElementById("description").value = this.dataset.description;

      const badgeSet = new Set((this.dataset.badges || "").split("|").filter(Boolean));
      document.querySelectorAll('input[name="badges"]').forEach((cb) => {
        cb.checked = badgeSet.has(cb.value);
      });

      document.getElementById("product-form").action = "/admin/products/update";
      document.getElementById("submit-btn").textContent = "Update Product";
      document.getElementById("cancel-edit").style.display = "inline-block";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Cancel Edit
  document.getElementById("cancel-edit")?.addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("product-form").reset();
    document.getElementById("productId").value = "";
    document.getElementById("product-form").action = "/admin/products";
    document.getElementById("submit-btn").textContent = "Add Product";
    this.style.display = "none";
    document.getElementById("file-name").textContent = "No file chosen";
  });
});

// === QUẢN LÝ ĐƠN HÀNG – AJAX + SOCKET.IO ===
document.addEventListener("DOMContentLoaded", function () {
  // Chỉ chạy trên trang admin/orders
  if (!document.querySelector(".container-admin-orders")) return;

  // Cập nhật trạng thái bằng AJAX
  document.querySelectorAll(".status-form").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const orderId = form.dataset.orderId;
      const status = form.querySelector(".status-select").value;

      try {
        const res = await fetch(`/admin/orders/${orderId}/status`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });

        if (res.ok) {
          const badge = document.getElementById(`status-${orderId}`);
          badge.textContent = form.querySelector(`option[value="${status}"]`).textContent;
          badge.className = `badge status-badge ${status}`;
          alert("Cập nhật thành công!");
        } else {
          alert("Cập nhật thất bại");
        }
      } catch (err) {
        alert("Lỗi kết nối");
      }
    });
  });

  // SOCKET.IO: Cập nhật real-time khi có người khác đổi trạng thái
  const socket = io();
  socket.on("order:update", (data) => {
    const badge = document.getElementById(`status-${data.orderId}`);
    if (badge) {
      const statusText =
        {
          pending: "Chờ xác nhận",
          processing: "Đang xử lý",
          shipped: "Đã giao vận chuyển",
          delivered: "Đã giao hàng",
          cancelled: "Đã hủy",
          paid: "Đã thanh toán",
        }[data.status] || data.status;

      badge.textContent = statusText;
      badge.className = `badge status-badge ${data.status}`;
    }
  });
});
