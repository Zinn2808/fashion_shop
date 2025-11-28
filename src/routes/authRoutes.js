import { Router } from "express";
import {
  getLogin,
  postLogin,
  getRegister,
  postRegister,
  logout,
} from "../controllers/authController.js";

const r = Router();

r.get("/login", getLogin);
r.post("/login", postLogin);
r.get("/register", getRegister);
r.post("/register", postRegister);
r.post("/logout", logout);

export default r;
