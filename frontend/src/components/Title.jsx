import React from "react";

const Title = ({ text1, text2, text3 }) => {
  return (
    <div>
      <div className="inline-flex gap-2 items-center mb-3">
        <h2 className="text-gray-500 uppercase">
          {text1} <span className="text-gray-700 font-medium">{text2}</span>
        </h2>
        <span className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700"></span>
      </div>
      {text3 && (
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          {text3}
        </p>
      )}
    </div>
  );
};

export default Title;
