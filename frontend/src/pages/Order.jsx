import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { products } from '../assets/assets';
import axios from 'axios';

const Order = () => {
    const { backendUrl, token, currency} = useContext(ShopContext);
    const [orderData, setOrderData] = useState([])
    const loadOrderData = async () => {
        try {
            if (!token) {
                return null;
            }

            const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { Authorization: `Bearer ${token}` } })
            if (response.data.success) {
                let allOrdersItem = []
                response.data.orders.map((order) => {
                    order.items.map((item) => {
                        item['status'] = order.status
                        item['payment'] = order.payment
                        item['paymentMethod'] = order.paymentMethod
                        item['date'] = order.date

                        allOrdersItem.push(item)
                    })
                })
                setOrderData(allOrdersItem.reverse());
                
            }

        } catch (error) {
            
        }
    }

    useEffect(() =>{
        loadOrderData()
    }, [token])
  return (
    <section className="order-section pt-16">
        <div className="container">
            <div className="text-2xl">
                <Title text1={'My'} text2={'Order'}/>
            </div>
            <div>
                {
                    orderData.map((item, index)=>(
                        <div className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4" key={index}>
                            <div className="flex items-start gap-6 text-sm">
                                <img src={item.image[0]} className='w-16 smLw-20' alt={item.name} />
                                <div className="">
                                    <p className='sm:text-base font-medium'>{item.name}</p>
                                    <div className="flex items-center gap-3 mt-1 text-base text-gray-600">
                                        <p>{currency}{item.price}</p>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Size: {item.size}</p>
                                    </div>
                                    <p>Date: <span className="text-gray-400">{new Date(item.date).toDateString()}</span></p>
                                    <p>Payment: <span className="text-gray-400">{item.paymentMethod}</span></p>
                                </div>
                            </div>
                            <div className="md:w-1/2 flex justify-between">
                                <div className="flex items-center gap-2">
                                    <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                                    <p className='text-sm ms:text-base'>{item.status}</p>
                                </div>
                                <button className="btn-box btn-transprance" onClick={loadOrderData }>Track Order</button>
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
