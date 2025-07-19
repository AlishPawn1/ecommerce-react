import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import BannerSlider from '../components/BannerSlider'
import DealSection from '../components/DealSection'
import TopProducts from '../components/TopProducts'
import TopRated from '../components/TopRated'
import NewsletterBox from '../components/NewsletterBox'

const Home = () => {
    return (
        <main>
            <BannerSlider/>
            <OurPolicy/>
            <TopRated />
            <DealSection/>
            <LatestCollection/>
            <Hero/>
            <BestSeller/>
            <TopProducts/>
            <NewsletterBox/>
        </main>
    )
}

export default Home
