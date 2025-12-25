import Product from "../models/Product.js";

export const home = async (req, res) => {
  try {
    const [featured, bestSellers, brands] = await Promise.all([
      Product.find({ badges: "featured" }).sort({ createdAt: -1 }).limit(3),
      Product.find({ badges: "bestseller" }).sort({ createdAt: -1 }).limit(3),
      Product.find({ badges: "brand" }).sort({ createdAt: -1 }).limit(3),
    ]);

    res.render("home", {
      title: "Kevin's Shop",
      featured,
      bestSellers,
      brands,
    });
  } catch (err) {
    console.error("Lỗi khi render trang chủ:", err);
    res.status(500).send("Lỗi server");
  }
};

export const list = async (req, res) => {
  const { q, category, min, max } = req.query;
  const filter = {};
  if (q) filter.name = { $regex: q, $options: "i" };
  if (category) filter.category = category;
  if (min || max)
    filter.price = {
      ...(min ? { $gte: Number(min) } : {}),
      ...(max ? { $lte: Number(max) } : {}),
    };
  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.render("products", { title: "Sản phẩm", products, query: req.query });
};

export const detail = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) return res.status(404).send("Not Found");
  res.render("product-detail", { title: product.name, product });
};
