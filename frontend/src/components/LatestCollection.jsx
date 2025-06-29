import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      setLatestProducts(products.slice(0, 10));
    }
  }, [products]);

  return (
    <section className='latest-collection-section my-10'>
      <div className='container'>
        <div className='text-center py-8 text-3xl'>
          <Title text1={'Latest'} text2={'Collection'} text3={'Discover our newest arrivals—fresh styles, trending designs, and exclusive products just for you.'} />
        </div>

        {/* rendering products */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
          {latestProducts.length > 0 ? (
            latestProducts.map((item, index) => (
              <ProductItem key={index} _id={item._id} slug={item.slug} image={item.image} name={item.name} price={item.price} stock={item.stock}/>
            ))
          ) : (
            <p>No products available</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default LatestCollection;
