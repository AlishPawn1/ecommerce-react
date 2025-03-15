import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom';

const ProductItem = ({ _id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link className='text-gray-700 cursor-pointer' to={`/product/${_id}`}>
      <div className='overflow-hidden image h-[250px]'>
        {/* Check if image exist */}
        {image && image?.length > 0 ? (
          <img src={image[0]} alt={name} className='hover:scale-110 transition w-full h-full object-cover ease-in-out' />
        ) : (
          <p>Image not available</p>
        )}
      </div>
      <div className='content'>
        <h3 className='pt-3 pb-1 text-sm'>{name}</h3>
        <p className='text-sm font-medium'>{currency}{price}</p>
      </div>
    </Link>
  );
}

export default ProductItem;
