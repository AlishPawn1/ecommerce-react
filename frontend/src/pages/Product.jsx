import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext"; // Fixed typo in import path
import RelatedProduct from "../components/RelatedProduct";
import { assets } from "../assets/assets"; // Assuming placeholder images exist

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  // Fetch product data when `products` or `productId` changes
  useEffect(() => {
    if (products.length > 0) {
      const foundProduct = products.find(
        (item) => item.id === Number(productId)
      );

      if (foundProduct) {
        setProductData(foundProduct);
        setImage(foundProduct.images?.[0] || assets.placeholderImage); // Fallback image
      } else {
        console.warn(`⚠️ Product with ID ${productId} not found.`);
      }
    }
  }, [products, productId]);

  return productData ? (
    <section className="product-detail-section">
      <div className="container">
        <div className="transition-opacity ease-in duration-500 opacity-100">
          <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
            {/* Product Images */}
            <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
              <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
                {productData?.images?.map((item, index) => (
                  <img
                    key={index}
                    src={item}
                    className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                    alt={`Product ${index + 1}`}
                    onClick={() => setImage(item)}
                  />
                ))}
              </div>
              <div className="flex-1 flex items-center justify-center">
                <img
                  src={image}
                  className="max-w-full max-h-[400px] object-contain"
                  alt="Selected Product"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="flex-1">
              <h1 className="text-2xl font-medium ">{productData?.name || "Unknown Product"}</h1>
              <p className="text-xl font-semibold mt-4">
                {currency}{productData?.price || "N/A"}
              </p>
              <p className="text-gray-600 mt-2">{productData?.description || "No description available."}</p>
              
              {/* Size Selection */}
              {productData?.size?.length > 0 && (
                <div className="flex flex-col gap-4 my-8">
                  <p>Select Size</p>
                  <div className="flex gap-2">
                    {productData?.size?.map((item, index) => (
                      <button 
                        key={index} 
                        onClick={() => setSize(item)} 
                        className={`border p-2 bg-gray-100 ${item === size ? 'border-orange-500' : ''}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button 
                onClick={() => addToCart(productData?.id, size)} 
                className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700 uppercase"
                disabled={!size} // Prevent adding to cart without selecting size
              >
                Add to cart
              </button>

              <hr className="mt-8 sm:w-4/5 " />

              {/* Product Info */}
              <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
                <p>100% Original product.</p>
                <p>Cash on delivery is available on this product.</p>
                <p>Easy return and exchange policy within 7 days.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-20">
          <div className="flex">
            <p className="border px-5 py-3 text-sm">Description</p>
            <p className="border px-5 py-3 text-sm">Review (122)</p>
          </div>
          <div className="flex flex-col gap-4 border p-6 text-sm text-gray-500">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima vel esse ad dignissimos deleniti autem, molestiae eveniet excepturi, dolore culpa reprehenderit expedita placeat debitis sequi porro modi itaque voluptatibus non?</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta officiis unde adipisci ratione totam sit doloribus, blanditiis earum pariatur porro cum maxime, aspernatur ipsum neque voluptatum quia tempore! Quo, similique?</p>
          </div>
        </div>

        {/* Display Related Products */}
        {productData?.category && (
          <RelatedProduct 
            category={productData.category} 
            subCategory={productData?.subCategory} 
          />
        )}
      </div>
    </section>
  ) : (
    <div className="text-center py-20">Loading product...</div>
  );
};

export default Product;
