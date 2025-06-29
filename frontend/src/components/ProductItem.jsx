import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ _id, slug, image, name, price, stock }) => {
    const { currency } = useContext(ShopContext);

    return (
        <Link className="text-gray-700 cursor-pointer" to={`/product/${slug}`}>
            <div className="relative overflow-hidden image h-[250px]">
                {image && image?.length > 0 ? (
                    <img
                        src={image[0]}
                        alt={name}
                        className="hover:scale-110 transition w-full h-full object-cover ease-in-out"
                    />
                ) : (
                    <p>Image not available</p>
                )}
                {stock <= 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                        Out of Stock
                    </span>
                )}
            </div>
            <div className="content">
                <h3 className="pt-3 pb-1 text-sm">{name}</h3>
                <p className="text-sm font-medium">
                    {currency}
                    {price}
                </p>
            </div>
        </Link>
    );
};

export default ProductItem;