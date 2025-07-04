import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
    const { products } = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        if (products.length > 0) {
            const bestProduct = products.filter((item) => item.bestseller);
            setBestSeller(bestProduct.slice(0, 5));
        }
    }, [products]); 

    return (
        <section className='best-seller-section my-10'>
            <div className='container'>
                <div className='text-center py-8 text-3xl'>
                    <Title text1={'Best'} text2={'Seller'} text3={'Shop our most popular products—loved by customers and trusted for their quality and value.'} />
                </div>

                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                    {bestSeller.length > 0 ? (
                        bestSeller.map((item, index) => (
                            <ProductItem key={index} _id={item._id} slug={item.slug} image={item.image} name={item.name} price={item.price} stock={item.stock} />
                        ))
                    ) : (
                        <p>No products available</p>
                    )}
                </div>
            </div>
        </section>
    );
}

export default BestSeller;
