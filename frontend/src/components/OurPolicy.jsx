import React from "react";
import { assets } from "../assets/assets";

const OurPolicy = () => {
  return (
    <section className="policy-secction my-10">
      <div className="container">
        <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700">
          <div className="policy-box">
            <img src={assets.ExchangeImage} className="w-12 m-auto mb-5" />
            <h3 className="font-semibold">Easy Exange Policy</h3>
            <p className="text-gray-400">
              We offer hassle free exchange policy.
            </p>
          </div>
          <div className="policy-box">
            <img src={assets.returnImage} className="w-12 m-auto mb-5" />
            <h3 className="font-semibold">7 Days Return Policy</h3>
            <p className="text-gray-400">
              We provide 7 days free return policy.
            </p>
          </div>
          <div className="policy-box">
            <img src={assets.supportImage} className="w-12 m-auto mb-5" />
            <h3 className="font-semibold">Best Customer Support</h3>
            <p className="text-gray-400">We provide 24/7 Customer Support.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurPolicy;
