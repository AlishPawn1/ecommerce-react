import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import axios from "axios"; // Added axios import
import { backendUrl } from "../App"; // Added backendUrl import

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relavent");
  const [categories, setCategories] = useState([]); // State for fetched categories
  const [subCategories, setSubCategories] = useState([]); // State for fetched subcategories
  const [loading, setLoading] = useState(false); // Optional: for loading state
  const [error, setError] = useState(null); // Optional: for error handling

  // Fetch categories from database
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/product/categories`);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];
      setCategories(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch categories");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subcategories from database
  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/api/product/subcategories`,
      );
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];
      setSubCategories(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch subcategories");
      console.error("Error fetching subcategories:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const toggleCategory = (e) => {
    const value = e.target.value;
    if (category.includes(value)) {
      setCategory((prev) => prev.filter((item) => item !== value));
    } else {
      setCategory((prev) => [...prev, value]);
    }
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    if (subCategory.includes(value)) {
      setSubCategory((prev) => prev.filter((item) => item !== value));
    } else {
      setSubCategory((prev) => [...prev, value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category),
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory),
      ); // Adjusted to match database field
    }

    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();
    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <section className="collection-section">
      <div className="container">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 pt-10">
          {/* Filter Section */}
          <div className="min-w-60 sm:w-1/4">
            <h3
              onClick={() => setShowFilter(!showFilter)}
              className="my-2 text-xl font-semibold flex items-center cursor-pointer uppercase gap-4"
            >
              Filter
              <img
                src={assets.dropDown}
                alt=""
                className={`h-3 sm:hidden ${showFilter ? "rotate-180" : ""}`}
              />
            </h3>
            {/* Category Filter */}
            <div
              className={`border border-gray-300 pl-5 py-4 mt-6 ${showFilter ? "" : "hidden"} sm:block`}
            >
              <p className="mb-4 text-sm font-medium uppercase">Categories</p>
              {loading ? (
                <p>Loading categories...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <div className="flex flex-col gap-4 text-sm font-light text-gray-700">
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <label
                        key={cat._id}
                        className="flex gap-2 items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          value={cat._id} // Use _id for filtering
                          onChange={toggleCategory}
                          checked={category.includes(cat._id)}
                        />
                        {cat.name}
                      </label>
                    ))
                  ) : (
                    <p>No categories available</p>
                  )}
                </div>
              )}
            </div>

            {/* Subcategory Filter */}
            <div
              className={`border border-gray-300 pl-5 py-4 my-6 ${showFilter ? "" : "hidden"} sm:block`}
            >
              <p className="mb-4 text-sm font-medium uppercase">
                Subcategories
              </p>
              {loading ? (
                <p>Loading subcategories...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <div className="flex flex-col gap-4 text-sm font-light text-gray-700">
                  {subCategories.length > 0 ? (
                    subCategories.map((sub) => (
                      <label
                        key={sub._id}
                        className="flex gap-2 items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          value={sub._id} // Use _id for filtering
                          onChange={toggleSubCategory}
                          checked={subCategory.includes(sub._id)}
                        />
                        {sub.name}
                      </label>
                    ))
                  ) : (
                    <p>No subcategories available</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex-1">
            <div className="flex justify-between items-center text-base sm:text-2xl mb-6">
              <Title text1={"All"} text2={"Collection"} />
              <select
                onChange={(e) => setSortType(e.target.value)}
                className="border-2 outline-0 border-gray-300 text-sm px-4 py-2 rounded"
              >
                <option value="relavent">Sort by: Relevant</option>
                <option value="low-high">Sort by: Low to High</option>
                <option value="high-low">Sort by: High to Low</option>
              </select>
            </div>

            {/* Map Products */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 gap-y-8">
              {filterProducts.length > 0 ? (
                filterProducts.map((item, index) => (
                  <ProductItem
                    key={index}
                    _id={item._id}
                    slug={item.slug}
                    image={item.image}
                    name={item.name}
                    price={item.price}
                    stock={item.stock}
                  />
                ))
              ) : (
                <p>No products available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Collection;
