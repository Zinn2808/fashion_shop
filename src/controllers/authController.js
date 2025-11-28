import User from "../models/User.js";

export const getLogin = (req, res) => {
  res.render("login", { title: "Đăng nhập" });
};

export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.render("login", {
      title: "Đăng nhập",
      error: "Sai email hoặc mật khẩu",
    });
  }
  req.session.user = { _id: user._id, name: user.name, role: user.role };
  res.redirect("/");
};

export const getRegister = (req, res) => {
  res.render("register", { title: "Đăng ký" });
};

export const postRegister = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({ name, email, password });
    req.session.user = { _id: user._id, name: user.name, role: user.role };
    res.redirect("/");
  } catch (e) {
    res.render("register", { title: "Đăng ký", error: "Email đã tồn tại" });
  }
};

export const logout = (req, res) => {
  req.session.destroy(() => res.redirect("/"));
};
