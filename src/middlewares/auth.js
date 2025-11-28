// Yêu cầu phải đăng nhập
export function ensureAuth(req, res, next) {
  if (req.session.user) return next();

  // Lưu lại đường dẫn hiện tại để quay lại sau khi đăng nhập
  const nextUrl = encodeURIComponent(req.originalUrl);
  return res.redirect(`/auth/login?next=${nextUrl}`);
}

// Yêu cầu phải là admin
export function ensureAdmin(req, res, next) {
  const user = req.session.user;

  if (!user) {
    // Chưa đăng nhập → đưa về login
    const nextUrl = encodeURIComponent(req.originalUrl);
    return res.redirect(`/auth/login?next=${nextUrl}`);
  }

  if (user.role !== "admin") {
    // Có đăng nhập nhưng không phải admin → đưa về trang chủ
    return res.redirect("/");
  }

  // Là admin → tiếp tục
  next();
}
