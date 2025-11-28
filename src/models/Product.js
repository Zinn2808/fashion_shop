import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    category: String,
    description: String,
    images: [String],                
    badges: [String],
    colors: [String],                 
    sizes: [String],                  
    imagesByColor: { type: Map, of: String }, // map màu -> ảnh
    badges: {
    type: [String],
    default: [],
    enum: ["featured", "bestseller", "brand"],
    },
  },
  { timestamps: true }
);

productSchema.index({ badges: 1 });

export default mongoose.model("Product", productSchema);
