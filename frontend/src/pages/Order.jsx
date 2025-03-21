import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { products } from '../assets/assets';

const Order = () => {
    const { product, currency} = useContext(ShopContext);
  return (
    <section className="order-section pt-16">
        <div className="container">
            <div className="text-2xl">
                <Title text1={'My'} text2={'Order'}/>
            </div>
            <div>
                {
                    products.slice(1, 4).map((item, index)=>(
                        <div className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4" key={index}>
                            <div className="flex items-start gap-6 text-sm">
                                <img src={item.image[0]} className='w-16 smLw-20' alt={item.name} />
                                <div className="">
                                    <p className='sm:text-base font-medium'>{item.name}</p>
                                    <div className="flex items-center gap-3 mt-2 text-base text-gray-600">
                                        <p>{currency}{item.price}</p>
                                        <p>Quantity: 1</p>
                                        <p>Size: M</p>
                                    </div>
                                    <p>Date: <span className="text-gray-400">16, Feb 2025</span></p>
                                </div>
                            </div>
                            <div className="md:w-1/2 flex justify-between">
                                <div className="flex items-center gap-2">
                                    <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                                    <p className='text-sm ms:text-base'>Ready to ship</p>
                                </div>
                                <button className="btn-box btn-transprance">Track Order</button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    </section>
  )
}

export default Order
