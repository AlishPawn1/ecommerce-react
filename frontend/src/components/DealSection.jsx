import React from 'react'
import { NavLink } from "react-router-dom";
import { assets } from '../assets/assets'

const DealSection = () => {
    return (
        <section className="deal-section section-gap bg-cover bg-[0_-40px]" style={{backgroundImage: `url(${assets.sectionbg4})`, }}>
            <div className="container">
                <div className="flex sm:justify-end justify-center">
                    <div className="sm:w-7/12">
                        <div className="flex justify-center wow animate__ animate__zoomIn animated">
                            <div className="text-center">
                                <div className="title">
                                    <h3 className="heading mb-2">Explore Our Full Collection</h3>
                                </div>
                                <p className='pb-5'>Immerse yourself in the heritage of Newari culture through our traditional dresses and
                                    ornaments.</p>
                                <NavLink className="white-btn btn" to="/collection">
                                    Shop Now
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DealSection
