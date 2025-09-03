import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";

const BannerSlider = () => {
  return (
    <section className="main-banner bg-gray-100">
      <Splide
        options={{
          type: "fade",
          rewind: true,
          perPage: 1,
          pagination: true,
          arrows: false,
          updateOnMove: true,
        }}
        className="banner-slide"
      >
        <SplideSlide>
          <div
            className="banner"
            style={{
              backgroundImage: `url(${assets.girlNewariDress})`,
              backgroundPosition: "120% 100px",
              backgroundSize: "contain",
            }}
          >
            <div className="container">
              <div className="content d-flex align-items-center justify-content-start h-100">
                <div className="col-xl-6">
                  <div className="slide-animation">
                    <h1 className="heading under-line animated">
                      <span>Embrace</span> Tradition
                    </h1>
                    <p className="animated">
                      Discover the elegance of Newari traditional dresses and
                      intricate ornaments.
                    </p>
                    <NavLink className="white-btn btn" to="/collection">
                      Explore More
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SplideSlide>

        <SplideSlide>
          <div
            className="banner"
            style={{
              backgroundImage: `url(${assets.childNewariDress})`,
              backgroundPosition: "left bottom",
              backgroundSize: "contain",
            }}
          >
            <div className="container">
              <div className="content d-flex align-items-center justify-content-end h-100">
                <div className="col-xl-6">
                  <div className="slide-animation">
                    <h1 className="heading under-line animated">
                      <span>Follow</span> Us
                    </h1>
                    <p className="animated">
                      Stay updated on our latest collections of traditional
                      Newari attire.
                    </p>
                    <NavLink className="white-btn btn" to="/collection">
                      Explore More
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SplideSlide>
      </Splide>
    </section>
  );
};

export default BannerSlider;
