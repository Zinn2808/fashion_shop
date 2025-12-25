// server.js
import "dotenv/config";
import path from "path";
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import morgan from "morgan";
import { fileURLToPath } from "url";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import expressLayouts from "express-ejs-layouts";

import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

// Gắn io vào req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// === VIEW ENGINE ===
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/main");

// === MIDDLEWARES ===
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

// STATIC FILES – XỬ LỖI 500
app.use("/images", express.static(path.join(__dirname, "src/public/images")));
app.use(express.static(path.join(__dirname, "src/public")));

// === SESSION ===
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback_secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

// === DATABASE ===
await connectDB(process.env.MONGODB_URI);

// === LOCALS ===
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.cartCount = (req.session.cart || []).reduce((s, i) => s + i.qty, 0);
  next();
});

// === ROUTES ===
app.use("/", productRoutes);
app.use("/auth", authRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/admin", adminRoutes);

// === 404 PAGE ===
app.use((req, res) => {
  res.status(404).render("404", { title: "404 - Không tìm thấy" });
});

// === ERROR HANDLER ===
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(err.status || 500).render("error", {
    title: "Lỗi hệ thống",
    message: err.message || "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
  });
});

// === START SERVER ===
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// === SOCKET.IO ===
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
});
