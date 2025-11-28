import { Router } from "express";
import { home, list, detail } from "../controllers/productController.js";

const r = Router();

r.get("/", home);
r.get("/products", list);
r.get("/products/:slug", detail);

export default r;
