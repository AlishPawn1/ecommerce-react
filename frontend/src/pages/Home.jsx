import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewlettterBox from '../components/NewlettterBox'

const Home = () => {
  return (
    <main>
      <Hero/>
      <LatestCollection/>
      <BestSeller/>
      <OurPolicy/>
      <NewlettterBox/>
    </main>
  )
}

export default Home
