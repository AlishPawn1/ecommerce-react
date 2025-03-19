import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const CartTotal = () => {
    const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

    // Calculate subtotal, shipping fee, and total
    const subtotal = getCartAmount();
    const shippingFee = delivery_fee;
    const total = subtotal === 0 ? 0 : subtotal + shippingFee;

    return (
        <div className='w-full'>
            <div className="text-2xl">
                <Title text1={'Cart'} text2={'total'} />
            </div>
            <div className="flex flex-col gap-2 mt-2 text-sm">
                {/* Subtotal */}
                <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p>{currency}{subtotal}.00</p>
                </div>
                <hr />

                {/* Shipping Fee */}
                <div className="flex justify-between">
                    <p>Shipping Fee</p>
                    <p>{currency}{shippingFee}.00</p>
                </div>
                <hr />

                {/* Total */}
                <div className="flex justify-between">
                    <b>Total</b>
                    <b>{currency}{total}.00</b>
                </div>
            </div>
        </div>
    );
};

export default CartTotal;