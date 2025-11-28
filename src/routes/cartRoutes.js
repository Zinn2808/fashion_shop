import { Router } from "express";
import {
  viewCart,
  addToCart,
  updateQty,
  removeItem,
} from "../controllers/cartController.js";

const r = Router();

r.get("/", viewCart);
r.post("/add", addToCart);
r.post("/update", updateQty);
r.post("/remove", removeItem);

export default r;
