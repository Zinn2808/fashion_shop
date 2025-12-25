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
        description:
          "Wood blend with cowhide leather sleeves, fill and quilted satin lining. Snap front closure with double welt handwarmer pockets at lower front and interior chest pocket. Striped rib collar, cuffs and hem. Felt and chenille appliqué at front and back. Embroidered logo on chest and embroidered graphic on sleeve.",
        imagesByColor: {
          Red: "/images/products/Jackets/MickeyVarsityJacket_Red.jpg",
          Black: "/images/products/Jackets/MickeyVarsityJacket_Black.jpg",
        },
        images: ["/images/products/Jackets/MickeyVarsityJacket_Red.jpg", "/images/products/Jackets/MickeyVarsityJacket_Black.jpg"],
        badges: ["featured"],
      },
      {
        name: "BBSimon Vanson Leather Jacket",
        slug: "bbsimon-vanson-leather-jacket",
        price: 1289900,
        stock: 10,
        category: "Jackets",
        colors: ["Orange", "Black", "Brown"],
        sizes: ["S", "M", "L"],
        description:
          "Cowhide leather with rhinestones and metal studs throughout, fill and quilted nylon lining. Full zip closure with double welt zip hand pockets at lower front and interior chest pockets. Knit rib cuffs and hem. Studded leather logo appliqué at front, sleeves and back. Embroidered logo patches on sleeves. Rhinestone studded metal logo plate at back neck.",
        imagesByColor: {
          Orange: "/images/products/Jackets/BBSimonVansonLeatherJacket_Orange.jpg",
          Black: "/images/products/Jackets/BBSimonVansonLeatherJacket_Black.jpg",
          Brown: "/images/products/Jackets/BBSimonVansonLeatherJacket.jpg",
        },
        images: [
          "/images/products/Jackets/BBSimonVansonLeatherJacket.jpg",
          "/images/products/Jackets/BBSimonVansonLeatherJacket_Orange.jpg",
          "/images/products/Jackets/BBSimonVansonLeatherJacket_Black.jpg",
        ],
      },
      {
        name: "FaceMask Puffy",
        slug: "face-mask-puffy",
        price: 1289900,
        stock: 10,
        category: "Jackets",
        colors: ["Blue", "Black", "WoodlandCamo"],
        sizes: ["S", "M", "L"],
        description:
          "Water resistant Cordura® 2-Layer nylon ripstop with 700-Fill down insulated quilted baffles and poly lining. Full zip closure with snap placket. Double welt zip hand pockets at lower front and interior zip pockets. Removable hood with faux fur lining, interior elastic shockcord, tab adjuster and removable faux fur trim. Removable knit balaclava with zip closure. Elastic hem and cuffs with snap tab adjuster. Woven logo label at lower front and back neck tab. Embroidered graphic on cuff and printed logo on hood.",
        imagesByColor: {
          Blue: "/images/products/Jackets/FaceMaskPuffy_Blue.jpg",
          Black: "/images/products/Jackets/FaceMaskPuffy_Black.jpg",
          WoodlandCamo: "/images/products/Jackets/FaceMaskPuffy_WoodlandCamo.jpg",
        },
        images: [
          "/images/products/Jackets/FaceMaskPuffy_WoodlandCamo.jpg",
          "/images/products/Jackets/FaceMaskPuffy_Black.jpg",
          "/images/products/Jackets/FaceMaskPuffy_Blue.jpg",
        ],
      },
      {
        name: "Paneled Track Jacket",
        slug: "paneled-track-jacket",
        price: 1289900,
        stock: 10,
        category: "Jackets",
        colors: ["Grey", "Black", "Tan"],
        sizes: ["S", "M", "L"],
        description:
          "Water resistant Cordura® 2-Layer nylon ripstop with 700-Fill down insulated quilted baffles and poly lining. Full zip closure with snap placket. Double welt zip hand pockets at lower front and interior zip pockets. Removable hood with faux fur lining, interior elastic shockcord, tab adjuster and removable faux fur trim. Removable knit balaclava with zip closure. Elastic hem and cuffs with snap tab adjuster. Woven logo label at lower front and back neck tab. Embroidered graphic on cuff and printed logo on hood.",
        imagesByColor: {
          Grey: "/images/products/Jackets/PaneledTrackJacket_Grey.jpg",
          Black: "/images/products/Jackets/PaneledTrackJacket_Black.jpg",
          Tan: "/images/products/Jackets/PaneledTrackJacket_Tan.jpg",
        },
        images: [
          "/images/products/Jackets/PaneledTrackJacket_Grey.jpg",
          "/images/products/Jackets/PaneledTrackJacket_Black.jpg",
          "/images/products/Jackets/PaneledTrackJacket_Tan.jpg",
        ],
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
          White: "/images/products/Shirts/VansonWorkShirt_White.jpg",
          Black: "/images/products/Shirts/VansonWorkShirt_Black.jpg",
        },
        images: ["/images/products/Shirts/VansonWorkShirt_White.jpg", "/images/products/Shirts/VansonWorkShirt_Black.jpg"],
        badges: ["featured"],
      },
      {
        name: "Pinstripe Shirt",
        slug: "pinstripe-shirt",
        price: 578900,
        stock: 10,
        category: "Shirts",
        colors: ["Brown", "Black", "Pink"],
        sizes: ["S", "M", "L"],
        description: "Cotton blend with button down collar and embroidered logo on single chest pocket.",
        imagesByColor: {
          Brown: "/images/products/Shirts/PinstripeShirt_Brown.jpg",
          Black: "/images/products/Shirts/PinstripeShirt_Black.jpg",
          Pink: "/images/products/Shirts/PinstripeShirt_Pink.jpg",
        },
        images: [
          "/images/products/Shirts/PinstripeShirt_Black.jpg",
          "/images/products/Shirts/PinstripeShirt_Brown.jpg",
          "/images/products/Shirts/PinstripeShirt_Pink.jpg",
        ],
      },
      {
        name: "SmallBox Shirt",
        slug: "small-box-shirt",
        price: 578900,
        stock: 10,
        category: "Shirts",
        colors: ["SolidRed", "BlackDenim", "RinseWashedIndigo", "Lt", "White", "WoodlandCamo"],
        sizes: ["S", "M", "L"],
        description: "Cotton blend with button down collar and embroidered logo on single chest pocket.",
        imagesByColor: {
          SolidRed: "/images/products/Shirts/SmallBoxShirt_SolidRed.jpg",
          BlackDenim: "/images/products/Shirts/SmallBoxShirt_BlackDenim.jpg",
          RinseWashedIndigo: "/images/products/Shirts/SmallBoxShirt_RinseWashedIndigo.jpg",
          Lt: "/images/products/Shirts/SmallBoxShirt_LtWashedIndigo.jpg",
          White: "/images/products/Shirts/SmallBoxShirt_White.jpg",
          WoodlandCamo: "/images/products/Shirts/SmallBoxShirt_WoodlandCamo.jpg",
        },
        images: [
          "/images/products/Shirts/SmallBoxShirt_BlackDenim.jpg",
          "/images/products/Shirts/SmallBoxShirt_RinseWashedIndigo.jpg",
          "/images/products/Shirts/SmallBoxShirt_LtWashedIndigo.jpg",
          "/images/products/Shirts/SmallBoxShirt_White.jpg",
          "/images/products/Shirts/SmallBoxShirt_WoodlandCamo.jpg",
        ],
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
        description:
          "Brushed-back fleece with pouch pocket. Printed graphic on front and sleeve. Embroidered logo on hood. Original artwork by Kazuo Umezz.",
        images: ["/images/products/Sweaters/TheExorcistHoodedSweatshirt_Black.jpg"],
      },
      {
        name: "Olde College Intarsia Top",
        slug: "olde-college-intarsia-top",
        price: 778900,
        stock: 10,
        category: "Sweaters",
        colors: ["Black", "BrightFuchsia", "Navy", "White"],
        sizes: ["S", "M", "L"],
        description: "Cotton blend jersey crewneck with intarsia knit logos at sleeves.",
        imagesByColor: {
          Black: "/images/products/Sweaters/OldeCollegeIntarsiaTop_Black.jpg",
          BrightFuchsia: "/images/products/Sweaters/OldeCollegeIntarsiaTop_BrightFuchsia.jpg",
          Navy: "/images/products/Sweaters/OldeCollegeIntarsiaTop_Navy.jpg",
          White: "/images/products/Sweaters/OldeCollegeIntarsiaTop_White.jpg",
        },
        images: [
          "/images/products/Sweaters/OldeCollegeIntarsiaTop_Black.jpg",
          "/images/products/Sweaters/OldeCollegeIntarsiaTop_BrightFuchsia.jpg",
          "/images/products/Sweaters/OldeCollegeIntarsiaTop_Navy.jpg",
          "/images/products/Sweaters/OldeCollegeIntarsiaTop_White.jpg",
        ],
      },
      {
        name: "Small Box L/S Tee",
        slug: "small-box-ls-tee",
        price: 778900,
        stock: 10,
        category: "Sweaters",
        colors: ["AshGrey", "Black", "DarkRed", "IceBlue", "NeonYellow", "RealTree"],
        sizes: ["S", "M", "L"],
        description: "All cotton jersey crewneck with embroidered logo patch on chest.",
        imagesByColor: {
          AshGrey: "/images/products/Sweaters/SmallBoxLSTee_AshGrey.jpg",
          Black: "/images/products/Sweaters/SmallBoxLSTee_Black.jpg",
          DarkRed: "/images/products/Sweaters/SmallBoxLSTee_DarkRed.jpg",
          IceBlue: "/images/products/Sweaters/SmallBoxLSTee_IceBlue.jpg",
          NeonYellow: "/images/products/Sweaters/SmallBoxLSTee_NeonYellow.jpg",
          RealTree: "/images/products/Sweaters/SmallBoxLSTee_RealTree.jpg",
        },
        images: [
          "/images/products/Sweaters/SmallBoxLSTee_AshGrey.jpg",
          "/images/products/Sweaters/SmallBoxLSTee_Black.jpg",
          "/images/products/Sweaters/SmallBoxLSTee_DarkRed.jpg",
          "/images/products/Sweaters/SmallBoxLSTee_IceBlue.jpg",
          "/images/products/Sweaters/SmallBoxLSTee_NeonYellow.jpg",
          "/images/products/Sweaters/SmallBoxLSTee_RealTree.jpg",
        ],
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
        description:
          "Brushed-back fleece with on seam hand pockets and single back patch pocket. Elastic cuffs and waistband with interior drawcord. Printed graphic on front, sides and back. Embroidered logo on back pocket. Original artwork by Kazuo Umezz.",
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
        description:
          "All cotton canvas. Slanted front hand pockets with velcro flap cargo pockets at seat and thighs. Utility style with zip fly, single coin pocket, utility pockets and hammer 100p at left leg with woven logo taping. Zip-off lower legs with velero flap cargo pockets.",
        images: ["/images/products/Pants/UtilityWorkPant_Black.jpg"],
      },
      {
        name: "Cargo Pant",
        slug: "cargo-pant",
        price: 234900,
        stock: 10,
        category: "Pants",
        colors: ["Black", "Navy", "Olive", "Woodland"],
        sizes: ["S", "M", "L"],
        description:
          "All cotton ripstop with enzyme wash. Snap flap slanted front pockets and snap flap back pockets. Snap flap cargo pockets at thighs. Zip fly, snap closure, twill tape size adjusters at waist and drawstring at cuffs.",
        imagesByColor: {
          Black: "/images/products/Pants/CargoPant_Black.jpg",
          Navy: "/images/products/Pants/CargoPant_Navy.jpg",
          Olive: "/images/products/Pants/CargoPant_Olive.jpg",
          Woodland: "/images/products/Pants/CargoPant_Woodland.jpg",
        },
        images: [
          "/images/products/Pants/CargoPant_Black.jpg",
          "/images/products/Pants/CargoPant_Navy.jpg",
          "/images/products/Pants/CargoPant_Olive.jpg",
          "/images/products/Pants/CargoPant_Woodland.jpg",
        ],
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
          Black: "/images/products/Hats/ReaperSLogoTwoToneNE_Black.jpg",
          NavyScarlet: "/images/products/Hats/ReaperSLogoTwoToneNE_NavyScarlet.jpg",
        },
        images: ["/images/products/Hats/ReaperSLogoTwoToneNE_Black.jpg", "/images/products/Hats/ReaperSLogoTwoToneNE_NavyScarlet.jpg"],
      },
      {
        name: "Sport Polartec BN",
        slug: "sport-polartec-bn",
        price: 189000,
        stock: 10,
        category: "Hats",
        colors: ["Black", "HeatherGrey", "Navy", "Pink", "TrueTimberKoda"],
        sizes: ["S", "M", "L"],
        description: "Polartec® 200 fleece beanie with embroidered logos on front and sides.",
        imagesByColor: {
          Black: "/images/products/Hats/SportPolartecBN_Black.jpg",
          HeatherGrey: "/images/products/Hats/SportPolartecBN_HeatherGrey.jpg",
          Navy: "/images/products/Hats/SportPolartecBN_Navy.jpg",
          Pink: "/images/products/Hats/SportPolartecBN_Pink.jpg",
          TrueTimberKoda: "/images/products/Hats/SportPolartecBN_TrueTimberKoda.jpg",
        },
        images: [
          "/images/products/Hats/SportPolartecBN_Black.jpg",
          "/images/products/Hats/SportPolartecBN_HeatherGrey.jpg",
          "/images/products/Hats/SportPolartecBN_Navy.jpg",
          "/images/products/Hats/SportPolartecBN_Pink.jpg",
          "/images/products/Hats/SportPolartecBN_TrueTimberKoda.jpg",
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
