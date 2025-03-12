import React from 'react'

const PackageCards = () => {
  return (
    <div className='my-28'>
         <h1 className='font-extrabold text-3xl text-center p-16'>Tour Packages</h1>
        <div className='grid-cols-3 flex items-center justify-center gap-6'>
        {/* 1st card */}
        <div className="card w-61 h-[21] shadow-sm rounded-[40px]" >
        <h1 className="font-bold text-center p-2 ">Saint’s Martin</h1>
        <figure className="px-5 pt-5">
          <img
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            alt="Shoes"
            className="rounded-xl"
          />
        </figure>
        <div className="card-body items-center text-center px-2">
          <div className="flex  gap-5 p-2 text-[10px]">
            <p className="bg-[#D6EDEB] text-[#2D8985] px-2 rounded-2xl  ">Chill</p>
            <p>2 Night 3 Day</p>
            <p>20.5.23</p>
          </div>
          <div className="card-actions flex items-center p-2 gap-5">
            <p className="text-[18]"><span className="font-bold text-[24]">$850</span>/person</p>
            <button className="btn text-base-100 px-[16px] py-[8px] bg-[#177BA5] rounded-[40px] text-[12px]">Buy Now</button>
          </div>
        </div>
      </div>
      {/* second card */}
      <div className="card w-61 h-[21] shadow-sm rounded-[40px]" >
        <h1 className="font-bold text-center p-2 ">Saint’s Martin</h1>
        <figure className="px-5 pt-5">
          <img
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            alt="Shoes"
            className="rounded-xl"
          />
        </figure>
        <div className="card-body items-center text-center px-2">
          <div className="flex  gap-5 p-2 text-[10px]">
            <p className="bg-[#D6EDEB] text-[#2D8985] px-2 rounded-2xl  ">Chill</p>
            <p>2 Night 3 Day</p>
            <p>20.5.23</p>
          </div>
          <div className="card-actions flex items-center p-2 gap-5">
            <p className="text-[18]"><span className="font-bold text-[24]">$850</span>/person</p>
            <button className="btn text-base-100 px-[16px] py-[8px] bg-[#177BA5] rounded-[40px] text-[12px]">Buy Now</button>
          </div>
        </div>
      </div>

      {/* 3rd card */}
      <div className="card w-61 h-[21] shadow-sm rounded-[40px]" >
        <h1 className="font-bold text-center p-2 ">Saint’s Martin</h1>
        <figure className="px-5 pt-5">
          <img
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            alt="Shoes"
            className="rounded-xl"
          />
        </figure>
        <div className="card-body items-center text-center px-2">
          <div className="flex  gap-5 p-2 text-[10px]">
            <p className="bg-[#D6EDEB] text-[#2D8985] px-2 rounded-2xl  ">Chill</p>
            <p>2 Night 3 Day</p>
            <p>20.5.23</p>
          </div>
          <div className="card-actions flex items-center p-2 gap-5">
            <p className="text-[18]"><span className="font-bold text-[24]">$850</span>/person</p>
            <button className="btn text-base-100 px-[16px] py-[8px] bg-[#177BA5] rounded-[40px] text-[12px]">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default PackageCards