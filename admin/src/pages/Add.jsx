import React, { useState } from "react";
import { assets } from "../assets/assets";
import { backendUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [images, setImages] = useState([null, null, null, null]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [productPrice, setProductPrice] = useState("");
  const [stock, setStock] = useState("");
  const [isBestseller, setIsBestseller] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // New loading state

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

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!images.some((img) => img) || !productName || !productDescription || !productPrice || selectedSizes.length === 0) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    // Debugging the selectedSizes
    console.log("Selected Sizes:", selectedSizes);  // Log selected sizes to verify

    try {
        const formData = new FormData();
        formData.append("name", productName);
        formData.append("description", productDescription);
        formData.append("category", productCategory);
        formData.append("subCategory", subCategory);
        formData.append("price", productPrice);
        formData.append("size", JSON.stringify(selectedSizes)); // Sending the sizes as a JSON string
        formData.append("bestseller", isBestseller);
        formData.append("stock", stock);

        images.forEach((img, index) => {
          if (img) {
            formData.append(`image${index + 1}`, img);
          }
        });

        const response = await axios.post(`${backendUrl}/api/product/add`, formData, {headers: { token },});

        if (response.data.success) {
            toast.success(response.data.message);
            setProductName("");
            setProductDescription("");
            setProductCategory("Men");
            setSubCategory("Topwear");
            setProductPrice("");
            setStock("");
            setSelectedSizes([]);
            setIsBestseller(false);
            setImages([null, null, null, null]);
        } else {
            toast.error(response.data.message);
        }

    } catch (error) {
        console.error("Error adding product:", error.response ? error.response.data : error.message);
        setError("Error adding product. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-4 p-4 bg-white">
      {error && <p className="text-red-500">{error}</p>}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black opacity-80 flex items-center justify-center z-50">
          <div className="text-white text-lg font-semibold">Adding Product...</div>
        </div>
      )}

      <div>
        <p className="mb-2 font-semibold">Upload Images</p>
        <div className="flex gap-2">
          {images.map((img, index) => (
            <label key={index} className="cursor-pointer">
              <img
                className="w-24 h-24 object-cover"
                src={img ? URL.createObjectURL(img) : assets.upload_area}
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
          placeholder="Enter product name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </div>

      <div className="w-full">
        <p className="mb-2 font-semibold">Product Description</p>
        <textarea
          className="w-full max-w-lg px-3 py-2 border rounded-lg"
          placeholder="Write product description"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
        ></textarea>
      </div>

      <div className="flex flex-wrap gap-4 w-full">
        <div>
          <p className="mb-2 font-semibold">Product Category</p>
          <select
            className="w-full px-3 py-2 border rounded-lg"
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
          >
            {["Men", "Women", "Kids"].map((pc) => (
              <option key={pc} value={pc}>
                {pc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2 font-semibold">Sub Category</p>
          <select
            className="w-full px-3 py-2 border rounded-lg"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
          >
            {["Topwear", "Bottomwear", "Winterwear"].map((pc) => (
              <option key={pc} value={pc}>
                {pc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2 font-semibold">Product Price</p>
          <input
            type="number"
            className="w-28 px-3 py-2 border rounded-lg"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
          />
        </div>

        <div>
          <p className="mb-2 font-semibold">Stock</p>
          <input
            type="number"
            className="w-28 px-3 py-2 border rounded-lg"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>
      </div>

      <div>
        <p className="mb-2 font-semibold">Product Sizes</p>
        <div className="flex gap-3">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div
              key={size}
              className={`px-4 py-2 border rounded-lg cursor-pointer transition-all ${selectedSizes.includes(size) ? "bg-black text-white" : "bg-gray-200"}`}
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
          className="cursor-pointer"
          checked={isBestseller}
          onChange={() => setIsBestseller(!isBestseller)}
        />
        <label htmlFor="bestseller" className="cursor-pointer">Add to Bestseller</label>
      </div>

      <button
        type="submit"
        className="w-32 py-3 mt-4 cursor-pointer bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
};

export default Add;
