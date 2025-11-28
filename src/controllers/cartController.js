import Product from "../models/Product.js";

function getCart(req) {
  if (!req.session.cart) req.session.cart = [];
  return req.session.cart;
}

export const viewCart = (req, res) => {
  const cart = getCart(req);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  
  res.render("cart", { title: "Giỏ hàng", cart, total });
};

export const addToCart = async (req, res) => {
  const { productId, color, size } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.redirect('/products');

  const cart = req.session.cart || [];

  // key biến thể (id + màu + size)
  const idx = cart.findIndex(
    i => String(i.productId) === String(productId) && i.color === color && i.size === size
  );

  // Lấy ảnh theo màu: hỗ trợ Map hoặc object thường
  let imageByColor = null;
  if (product.imagesByColor instanceof Map) {
    imageByColor = product.imagesByColor.get(color);
  } else if (product.imagesByColor && typeof product.imagesByColor === 'object') {
    imageByColor = product.imagesByColor[color];
  }

  if (idx >= 0) {
    cart[idx].qty += 1;
  } else {
    cart.push({
      productId,
      name: product.name,
      price: product.price,
      image: imageByColor || product.images?.[0] || '/images/products/no-image.jpg',
      color: color || null,
      size: size || null,
      qty: 1
    });
  }

  req.session.cart = cart;
  res.redirect('/cart');
};

export const updateQty = (req, res) => {
  const { productId, qty } = req.body;
  const cart = getCart(req);
  const item = cart.find((i) => i.productId === productId);
  if (item) item.qty = Math.max(1, Number(qty) || 1);
  res.redirect("/cart");
};

export const removeItem = (req, res) => {
  const { productId, color = null, size = null } = req.body;
  const cart = getCart(req).filter(i => !(
    String(i.productId) === String(productId) &&
    (i.color || null) === (color || null) &&
    (i.size  || null) === (size  || null)
  ));
  req.session.cart = cart;
  res.redirect('/cart');
};

