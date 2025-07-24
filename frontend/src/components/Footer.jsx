import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'

const Footer = () => {
    const {navigate} = useContext(ShopContext);
  return (
    <footer>
        <div className='container'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-20 mt-40 text-sm'>
                <div>
                    <div className='siteLogo mb-5'>
                        <Link to="/">
                            <img src={assets.logo} className='w-auto' alt="logo"/>
                        </Link>
                    </div>
                    <p className='w-full md:w-2/3 text-gray-600'>Thank you for visiting our store. We’re committed to offering quality products, secure shopping, and exceptional customer service. Stay connected for the latest updates and exclusive offers.</p>
                </div>
                <div>
                    <h3 className='text-xl font-medium mb-5 uppercase'>Company</h3>
                    <ul className='flex flex-col gap-1 text-gray-600 capitalize'>
                        <li><Link to='/'>Home</Link></li>
                        {/* <li><span onClick={() => navigate('/about')} className='cursor-pointer'>About</span></li> */}
                        <li><Link to='/about'>About Us</Link></li>
                        <li><Link to='/info-policy'>Privacy Policy</Link></li>
                        <li><Link to='/contact'>Contact</Link></li>
                        <li><Link to='/collection'>Collection</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className='text-xl font-medium mb-5 uppercase'>Get in touch</h3>
                    <ul className='flex flex-col gap-1 text-gray-600 capitalize'>
                        <li><Link to='tel: +977 9876543210'>+977 9876543210</Link></li>
                        <li><Link to='mailto: Newaritraditionaldress@gmail.com'>Newaritraditionaldress@gmail.com</Link></li>
                    </ul>
                </div>
            </div>
            <div>
                <hr/>
                <p className='py-5 text-sm text-center'>Copyright 2025. Tradional Newari Dress. All right reserve</p>
            </div>
        </div>
    </footer>
  )
}

export default Footer
