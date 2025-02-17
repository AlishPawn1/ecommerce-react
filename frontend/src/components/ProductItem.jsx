import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom';

const ProductItem = ({ id, images, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
      <div className='overflow-hidden image h-[250px]'>
        {/* Check if images exist */}
        {images && images.length > 0 ? (
          <img src={images[0]} alt={name} className='hover:scale-110 transition w-full h-full object-cover ease-in-out' />
        ) : (
          <p>Image not available</p>
        )}
      </div>
      <div className='content'>
        <h3 className='pt-3 pb-1 text-sm'>{name}</h3>
        <p className='text-sm font-medium'>{currency}. {price}</p>
      </div>
    </Link>
  );
}

export default ProductItem;
