import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const RelatedProduct = ({ category, subCategory, currentProductId }) => {
    const { products } = useContext(ShopContext);
    const [related, setRelated] = useState([]);

    useEffect(() => {
        if (products.length > 0) {
            let productsCopy = products.slice();

            productsCopy = productsCopy.filter((item) => category === item.category);
            productsCopy = productsCopy.filter((item) => subCategory === item.subCategory);

            // Exclude the current product by ID
            productsCopy = productsCopy.filter((item) => item._id !== currentProductId);

            setRelated(productsCopy.slice(0, 5));
        }
    }, [products, category, subCategory, currentProductId]);

    return (
        <section className='related-section my-10'>
            <div className='container'>
                <div className='text-center py-8 text-3xl'>
                    <Title text1={'Related'} text2={'Product'} />
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                    {related.length > 0 ? (
                        related.map((item) => (
                            <ProductItem
                                key={item._id}
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

export default RelatedProduct;
