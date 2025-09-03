import React, { useState, useEffect } from "react";
import axios from "axios";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Test = () => {
  const [products, setProducts] = useState();
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/product/list",
      );
      setProducts(response.data.products);
      console.log(response.data.products);
      console.log(response.data.products[0]?._id);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <section className="best-seller-section my-10">
      <div className="container">
        <div className="text-center py-8 text-3xl">
          <Title
            text1={"Best"}
            text2={"Seller"}
            text3={"This is random text that content random text"}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {products?.length > 0 ? (
            products?.map((item, index) => (
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
        <img
          src="https://res.cloudinary.com/dbcjvgzpk/image/upload/v1741356429/hbleulwubntlykzrqqpn.png"
          alt=""
        />
      </div>
    </section>
  );
};

export default Test;
