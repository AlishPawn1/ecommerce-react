import React from 'react'
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <section className='hero-section'>
        <div className='container'>
            <div className='flex flex-col sm:flex-row border border-gray-400'>
                {/* Hero left side */}
                <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
                    <div className='text-[#414141]'>
                        <div className='flex items-center gap-2'>
                            <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
                            <p className='font-medium text-sm md:text-base uppercase'>our bestsellers</p>
                        </div>
                        <div className='content'>
                            <h1 className='text-3xl sm:py-3 lg:text-5xl leading-relaxed'>Latest Arrivals</h1>
                            <div className='flex items-center gap-2'>
                                <p className='font-semibold text-sm md:text-base uppercase'>shop now</p>
                                <p className='w-8 md:w-11 h-[1px] bg-[#414141]'></p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* hero right side */}
                <div className='w-full sm:w-1/2'>
                    <img className='w-full h-auto' src={assets.bannerImage} alt="banner-img" />
                </div>
            </div>
        </div>
    </section>
  )
}

export default Hero
