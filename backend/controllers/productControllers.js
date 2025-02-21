import { v2 as cloudinary } from "cloudinary";

// function for add product
const addProduct = async (req, res) => {
    try {
        const { 
            name, description, price, category, subCategory, size, bestseller, stock 
        } = req.body;

        console.log("Received Data:", req.files);

        if (!name || !description || !price || !category || !subCategory) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        console.log("Received Files:", req.files); // Debugging

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.json({ success: false, message: "No images uploaded" });
        }

        // Get images
        const imageFiles = [
            req.files.image1?.[0],
            req.files.image2?.[0],
            req.files.image3?.[0],
            req.files.image4?.[0]
        ].filter(Boolean); // Remove undefined values

        console.log("Images received:", imageFiles);

        let imageUrls = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'});
                return result.secure_url
            })
        )

        console.log("Uploaded image URLs:", imageUrls);

        // Save product to MongoDB
        const newProduct = new productModel({
            name,
            description,
            price,
            category,
            subCategory,
            size: Array.isArray(size) ? size : size.split(","),
            bestseller: bestseller === "true",
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

}

// function for remove product

const removeProduct = async (req, res) =>{

}

// function for single product

const singleProduct = async (req, res) =>{

}


export {listProduct, addProduct, removeProduct, singleProduct}