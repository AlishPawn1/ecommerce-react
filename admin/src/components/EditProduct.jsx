import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { assets } from "../assets/assets";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [token] = useState(localStorage.getItem("token")); // Get token from localStorage
  const [images, setImages] = useState([null, null, null, null]);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [additionalDescription, setAdditionalDescription] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [stock, setStock] = useState("");
  const [isBestseller, setIsBestseller] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProduct = async () => {
    try {
      setLoading(true);
      console.log("Fetching product with ID:", id);
      const res = await axios.post(`${backendUrl}/api/product/single`, { id });
      console.log("Single product response:", res.data);
      if (res.data.success) {
        const product = res.data.product;
        setProductName(product.name || "");
        setProductDescription(product.description || "");
        setAdditionalDescription(product.additionalDescription || "");
        setProductCategory(product.category || "");
        setSubCategory(product.subCategory || "");
        setProductPrice(product.price || "");
        setStock(product.stock || "0");
        setIsBestseller(product.bestseller || false);
        setSelectedSizes(product.size || []);
        const filledImages = [0, 1, 2, 3].map((i) => product.image?.[i] || null);
        setImages(filledImages);
      } else {
        toast.error(res.data.message || "Failed to fetch product");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching product");
      console.error("Fetch product error:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/categories`);
      setCategories(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load categories");
      console.error("Fetch categories error:", err);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/subcategories`);
      setSubCategories(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load subcategories");
      console.error("Fetch subcategories error:", err);
    }
  };

  useEffect(() => {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      toast.error("Invalid product ID");
      console.error("Invalid product ID:", id);
      navigate("/list");
      return;
    }
    if (!token) {
      toast.error("Please log in to continue");
      console.error("No token found in localStorage");
      navigate("/login");
      return;
    }
    console.log("Token found:", token); // Debug log
    fetchProduct();
    fetchCategories();
    fetchSubCategories();
  }, [id, token, navigate]);

  const handleImageChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);
    }
  };

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", productName);
      formData.append("description", productDescription);
      formData.append("additionalDescription", additionalDescription);
      formData.append("category", productCategory);
      formData.append("subCategory", subCategory);
      formData.append("price", productPrice);
      formData.append("size", JSON.stringify(selectedSizes));
      formData.append("bestseller", isBestseller);
      formData.append("stock", stock);

      images.forEach((img, i) => {
        if (img && img instanceof File) {
          formData.append(`image${i + 1}`, img);
        }
      });

      console.log("Updating product with ID:", id);
      console.log("Request headers:", { Authorization: `Bearer ${token}` });
      const res = await axios.put(`${backendUrl}/api/product/update/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Product updated");
        navigate("/list");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired or unauthorized. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error(err.response?.data?.message || "Error updating product");
      }
      console.error("Update product error:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="flex flex-col w-full items-start gap-4 p-4 bg-white">
      {error && <p className="text-red-500">{error}</p>}

      {loading && (
        <div className="fixed inset-0 bg-black opacity-80 flex items-center justify-center z-50">
          <div className="text-white text-lg font-semibold">Loading...</div>
        </div>
      )}

      <div>
        <p className="mb-2 font-semibold">Update Images</p>
        <div className="flex gap-2">
          {images.map((img, index) => (
            <label key={index} className="cursor-pointer">
              <img
                className="w-24 h-24 object-cover"
                src={img instanceof File ? URL.createObjectURL(img) : img || assets.upload_area}
                alt="Upload"
              />
              <input type="file" hidden onChange={(e) => handleImageChange(index, e)} />
            </label>
          ))}
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2 font-semibold">Product Name</p>
        <input
          type="text"
          className="w-full max-w-lg px-3 py-2 border rounded-lg"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2 font-semibold">Product Description</p>
        <textarea
          className="w-full max-w-lg px-3 py-2 border rounded-lg"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          required
        ></textarea>
      </div>

      <div className="w-full">
        <p className="mb-2 font-semibold">Additional Description</p>
        <textarea
          className="w-full max-w-lg px-3 py-2 border rounded-lg"
          value={additionalDescription}
          onChange={(e) => setAdditionalDescription(e.target.value)}
        ></textarea>
      </div>

      <div className="flex flex-wrap gap-4 w-full">
        <div>
          <p className="mb-2 font-semibold">Category</p>
          <select
            className="w-full px-3 py-2 border rounded-lg"
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2 font-semibold">Subcategory</p>
          <select
            className="w-full px-3 py-2 border rounded-lg"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            required
          >
            <option value="">Select Subcategory</option>
            {subCategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2 font-semibold">Price</p>
          <input
            type="number"
            className="w-28 px-3 py-2 border rounded-lg"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            min="0"
            required
          />
        </div>

        <div>
          <p className="mb-2 font-semibold">Stock</p>
          <input
            type="number"
            className="w-28 px-3 py-2 border rounded-lg"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            min="0"
            required
          />
        </div>
      </div>

      <div>
        <p className="mb-2 font-semibold">Sizes</p>
        <div className="flex gap-3">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div
              key={size}
              className={`px-4 py-2 border rounded-lg cursor-pointer transition-all ${
                selectedSizes.includes(size) ? "bg-gray-800 text-white" : "bg-gray-200"
              }`}
              onClick={() => toggleSize(size)}
            >
              {size}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <input
          type="checkbox"
          id="bestseller"
          checked={isBestseller}
          onChange={() => setIsBestseller(!isBestseller)}
          className="cursor-pointer"
        />
        <label htmlFor="bestseller" className="cursor-pointer">Mark as Bestseller</label>
      </div>

      <button
        type="submit"
        className="w-32 py-3 mt-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Product"}
      </button>
    </form>
  );
};

export default EditProduct;