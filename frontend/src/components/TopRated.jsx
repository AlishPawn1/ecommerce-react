import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import Title from "./Title";

const TopRated = () => {
  const { fetchTopProducts } = useContext(ShopContext);
  const [topRated, setTopRated] = useState([]);

  useEffect(() => {
    const loadTopProducts = async () => {
      try {
        const rated = await fetchTopProducts("averageRating");
        setTopRated(rated);
      } catch (error) {
        console.error("Error fetching top products:", error);
      }
    };
    loadTopProducts();
  }, [fetchTopProducts]);

  return (
    <section className="top-products-section py-10 pb-20 bg-[#f5f5f5]">
      <div className="container">
        <div className="text-center py-8 text-3xl">
          <Title
            text1={"Top"}
            text2={"Rated"}
            text3={
              "Explore our most loved items, rated highly by real customers for quality and satisfaction."
            }
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {topRated.length > 0 ? (
            topRated.map((item, index) => (
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
    </section>
  );
};

export default TopRated;
