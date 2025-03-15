import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";


// function for add product
const addProduct = async (req, res) => {
    try {
        const { 
            name, description, price, category, subCategory, size, bestseller, stock 
        } = req.body;

        // console.log("Received Data:", req.body);
        // console.log("Received Files:", req.files); // Debugging

        if (!name || !description || !price || !category || !subCategory) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.json({ success: false, message: "No images uploaded" });
        }

        // Extract images from req.files
        const imageFiles = [
            req.files.image1?.[0],
            req.files.image2?.[0],
            req.files.image3?.[0],
            req.files.image4?.[0]
        ].filter(Boolean); // Remove undefined values

        // console.log("Images received:", imageFiles);

        let imageUrls = await Promise.all(
            imageFiles.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        );

        console.log("Uploaded image URLs:", imageUrls);

        // Save product to MongoDB
        const newProduct = new productModel({
            name,
            description,
            price,
            category,
            subCategory,
            size: Array.isArray(size) ? size : size.split(","),
            bestseller: bestseller === "true" ? true : false,
            stock: parseInt(stock, 10),
            image: imageUrls.filter(Boolean), // Remove failed uploads
            date: Date.now(),
        });

        await newProduct.save();

        res.json({ success: true, message: "Product added successfully", product: newProduct });

    } catch (error) {
        console.error("Error in addProduct:", error);
        res.json({ success: false, message: error.message });
    }
};


// function for list product

const listProduct = async (req, res) =>{
    try{
        const products = await productModel.find({});

        res.status(200).json({sucess: true, message: "Product retrieved successfully", products:products})
    }catch(error){
        res.status(500).json({sucess: false, message: "Failed to retrived product"})
    }
}

// function for remove product

const removeProduct = async (req, res) =>{
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success: true, message: "Product Removed"})
    } catch (error) {
        console.error("Error in removeProduct:", error);
        res.json({ success: false, message: error.message });
    }
}

// function for single product

const singleProduct = async (req, res) =>{
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId);
        res.json({ success: true, product});
    } catch (error) {
        console.error("Error in singleProduct:", error);
        res.json({ success: false, message: error.message });  
    }
}


export {listProduct, addProduct, removeProduct, singleProduct}