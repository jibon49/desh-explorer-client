import React from 'react'
import Banner from '../Home/Banner/Banner'
import backImg from '../../assets/banner3.jpg'

const CustomTour = () => {
  return (
    <div>
        <Banner
        bgImage={backImg}
        heading="Customize your tour plan"
        text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum unde mollitia voluptatibus dolores expedita temporibus deleniti, quia praesentium repudiandae eius?"
        >
        </Banner>
    </div>
  )
}

export default CustomTour