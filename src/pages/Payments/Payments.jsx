import React from 'react'
import bgImg from '../../assets/tourbg.jpg'
import Banner from '../Home/Banner/Banner'

const Payments = () => {
  return (
    <>
    <Banner
        bgImage={bgImg}
        heading="Payment"
        text="Please complete your payment to confirm your booking."
      />
      <div>
        This is the payment page. You can integrate your payment gateway here.
      </div>
    </>
  )
}

export default Payments