import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import Title from "./Title";

const TopProducts = () => {
  const { fetchTopProducts } = useContext(ShopContext);
  const [topViewed, setTopViewed] = useState([]);

  useEffect(() => {
    const loadTopProducts = async () => {
      try {
        const viewed = await fetchTopProducts("viewCount");
        setTopViewed(viewed);
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
            text2={"Viewed"}
            text3={
              "Check out the most viewed products—what everyone’s browsing and can’t stop looking at."
            }
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {topViewed.length > 0 ? (
            topViewed.map((item, index) => (
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

export default TopProducts;
