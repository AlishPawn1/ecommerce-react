import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewlettterBox from '../components/NewlettterBox'
import BannerSlider from '../components/BannerSlider'
import DealSection from '../components/DealSection'

const Home = () => {
    return (
        <main>
            <BannerSlider/>
            <OurPolicy/>
            <DealSection/>
            <LatestCollection/>
            <Hero/>
            <BestSeller/>
            <NewlettterBox/>
        </main>
    )
}

export default Home
