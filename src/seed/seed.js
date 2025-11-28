import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";
import Product from "../models/Product.js";

dotenv.config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await Promise.all([User.deleteMany({}), Product.deleteMany({})]);

    const admin = await User.create({
      name: "Admin",
      email: process.env.ADMIN_EMAIL || "admin@example.com",
      password: process.env.ADMIN_PASSWORD || "admin123",
      role: "admin",
    });

    const user = await User.create({
      name: "User",
      email: process.env.USER_EMAIL || "user@example.com",
      password: process.env.USER_PASSWORD || "user123",
      role: "user",
    });

    const products = await Product.insertMany([
      // Jackets
      {
        name: "Mickey Mouse Varsity Jacket",
        slug: "mickey-mouse-varsity-jacket",
        price: 1289900,
        stock: 10,
        category: "Jackets",
        colors: ["Red", "Black"],
        sizes: ["S", "M", "L"],
        description: "Wood blend with cowhide leather sleeves, fill and quilted satin lining. Snap front closure with double welt handwarmer pockets at lower front and interior chest pocket. Striped rib collar, cuffs and hem. Felt and chenille appliqué at front and back. Embroidered logo on chest and embroidered graphic on sleeve.",
        imagesByColor: {
          "Red": "/images/products/Jackets/MickeyVarsityJacket_Red.jpg",
          "Black": "/images/products/Jackets/MickeyVarsityJacket_Black.jpg",
        },
        images: ["/images/products/Jackets/MickeyVarsityJacket_Red.jpg"],
        badges: ["featured"],
      },
      // Shirts
      {
        name: "S Work Shirt",
        slug: "s-work-shirt",
        price: 578900,
        stock: 10,
        category: "Shirts",
        colors: ["White", "Black"],
        sizes: ["S", "M", "L"],
        description: "All cotton with utility pockets at chest. Embroidered logo on chest. Embroidered logo patch on chest and back.",
        imagesByColor: {
          "White": "/images/products/Shirts/VansonWorkShirt_White.jpg",
          "Black": "/images/products/Shirts/VansonWorkShirt_Black.jpg",
        },
        images: ["/images/products/Shirts/VansonWorkShirt_White.jpg"],
        badges: ["featured"],
      },
      // Sweaters
      {
        name: "Cable Hooded Sweater",
        slug: "cable-hooded-sweater",
        price: 778900,
        stock: 10,
        category: "Sweaters",
        colors: ["Black"],
        sizes: ["S", "M", "L"],
        description: "Wool blend with brushed-back fleece hood. Enbroidered logo on hood.",
        images: ["/images/products/Sweaters/CableHoodedSweater_Black.jpg"],
        badges: ["featured"],
      },
      {
        name: "Logo Haft-Zip Sweater",
        slug: "logo-haft-zip-sweater",
        price: 778900,
        stock: 10,
        category: "Sweaters",
        colors: ["Red"],
        sizes: ["S", "M", "L"],
        description: "Acrylic with haft zip closure and raised embroidered logo on chest.",
        images: ["/images/products/Sweaters/LogoHalfZipSweater_Red.jpg"],
      },
      {
        name: "The Exorcist Hooded Sweatshirt",
        slug: "the-exorcist-hooded-sweatshirt",
        price: 778900,
        stock: 10,
        category: "Sweaters",
        colors: ["Black"],
        sizes: ["S", "M", "L"],
        description: "Brushed-back fleece with pouch pocket. Printed graphic on front and sleeve. Embroidered logo on hood. Original artwork by Kazuo Umezz.",
        images: ["/images/products/Sweaters/TheExorcistHoodedSweatshirt_Black.jpg",],
      },
      // pants
      {
        name: "The Exorcist Sweatpant",
        slug: "the-exorcist-sweatpant",
        price: 534900,
        stock: 10,
        category: "Pants",
        colors: ["Black"],
        sizes: ["S", "M", "L"],
        description: "Brushed-back fleece with on seam hand pockets and single back patch pocket. Elastic cuffs and waistband with interior drawcord. Printed graphic on front, sides and back. Embroidered logo on back pocket. Original artwork by Kazuo Umezz.",
        images: ["/images/products/Pants/TheExorcistSweatpant_Black.jpg"],
      },
      {
        name: "Utility Work Pant",
        slug: "utility-work-pant",
        price: 234900,
        stock: 10,
        category: "Pants",
        colors: ["Black"],
        sizes: ["S", "M", "L"],
        description: "All cotton canvas. Slanted front hand pockets with velcro flap cargo pockets at seat and thighs. Utility style with zip fly, single coin pocket, utility pockets and hammer 100p at left leg with woven logo taping. Zip-off lower legs with velero flap cargo pockets.",
        images: ["/images/products/Pants/UtilityWorkPant_Black.jpg"],
      },
      // Hats
      {
        name: "Reaper S Logo",
        slug: "reaper-s-logo",
        price: 189000,
        stock: 10,
        category: "Hats",
        colors: ["Black", "NavyScarlet"],
        sizes: ["S", "M", "L"],
        description: "Poly New Era® 59FIFTY baseball hat with embroideries on front, sides and back.",
        imagesByColor: {
          "Black": "/images/products/Hats/ReaperSLogoTwoToneNE_Black.jpg",
          "NavyScarlet": "/images/products/Hats/ReaperSLogoTwoToneNE_NavyScarlet.jpg",
        },
        images: [
          "/images/products/Hats/ReaperSLogoTwoToneNE_Black.jpg",
          "/images/products/Hats/ReaperSLogoTwoToneNE_NavyScarlet.jpg",
        ],
      },
    ]);

    console.log("Seeded:", { admin: admin.email, products: products.length });
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

run();
