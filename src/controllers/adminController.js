import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import path from "path";

const slugify = (str = "") =>
  String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const parseCSV = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val.flatMap(parseCSV);
  return String(val)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

export const dashboard = async (req, res) => {
  const [pCount, oCount, uCount] = await Promise.all([Product.countDocuments(), Order.countDocuments(), User.countDocuments()]);
  res.render("admin/dashboard", {
    title: "Admin Dashboard",
    pCount,
    oCount,
    uCount,
    isAdmin: true,
  });
};

export const adminProducts = async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.render("admin/products", {
    title: "Quản lý sản phẩm",
    products,
    isAdmin: true,
  });
};

export const adminCreateProduct = async (req, res) => {
  const { name, price, stock = 0, category = "Khác", description = "", badges, colors, sizes } = req.body;

  // badges có thể là string hoặc array
  const badgesArr = Array.isArray(badges) ? badges : badges ? [badges] : [];

  // colors/sizes từ input “comma separated”
  const colorsArr = parseCSV(colors);
  const sizesArr = parseCSV(sizes);

  // ảnh (nếu up)
  let images = [];
  if (req.file) {
    const rel = "/images/products/" + path.basename(req.file.path);
    images = [rel];
  }

  await Product.create({
    name,
    slug: slugify(name) + "-" + Date.now().toString(36),
    price: Number(price),
    stock: Number(stock),
    category,
    description,
    badges: badgesArr,
    colors: colorsArr,
    sizes: sizesArr,
    images,
  });

  res.redirect("/admin/products");
};

// ✅ Update
export const adminUpdateProduct = async (req, res) => {
  const { productId, name, price, stock = 0, category = "Khác", description = "", badges, colors, sizes } = req.body;

  const badgesArr = Array.isArray(badges) ? badges : badges ? [badges] : [];
  const colorsArr = parseCSV(colors);
  const sizesArr = parseCSV(sizes);

  const $set = {
    name,
    slug: slugify(name), // có thể thêm hậu tố thời gian nếu muốn unique
    price: Number(price),
    stock: Number(stock),
    category,
    description,
    badges: badgesArr,
    colors: colorsArr,
    sizes: sizesArr,
  };

  if (req.file) {
    const rel = "/images/products/" + path.basename(req.file.path);
    $push.images = [rel]; // nếu muốn cộng dồn ảnh: dùng $push/$addToSet thay vì ghi đè
  }

  await Product.updateOne({ _id: productId }, { $set });
  res.redirect("/admin/products");
};

export const adminDeleteProduct = async (req, res) => {
  const { id } = req.params;
  await Product.deleteOne({ _id: id });
  res.redirect("/admin/products");
};

export const adminOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).populate("user").populate("items.product");
  res.render("admin/orders", {
    title: "Quản lý đơn hàng",
    orders,
    isAdmin: true,
  });
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    // Gửi socket cho khách hàng
    req.io.emit("order:update", {
      orderId: String(order._id),
      status: order.status,
    });

    // TRẢ JSON CHO AJAX
    res.json({ success: true, status: order.status });
  } catch (err) {
    res.status(500).json({ error: "Lỗi cập nhật" });
  }
};

export const adminUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.render("admin/users", {
    title: "Quản lý người dùng",
    users,
    isAdmin: true,
  });
};

export const getOrderDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id).populate("user").populate("items.product");
    if (!order) {
      return res.status(404).send("Đơn hàng không tồn tại");
    }
    res.render("admin/orderDetail", {
      title: `Chi tiết đơn hàng #${order._id}`,
      order,
      isAdmin: true,
    });
  } catch (err) {
    res.status(500).send("Lỗi server");
  }
};
