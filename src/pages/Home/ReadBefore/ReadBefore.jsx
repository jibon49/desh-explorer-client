import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import cardImg from "../../../assets/banner.jpeg";

const ReadBefore = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.3 },
    },
  };

  const linkVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        delay: 0.4,
        duration: 0.5,
      },
    },
    hover: {
      x: 5,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div ref={ref} className="my-16 overflow-hidden">
      <motion.h1 
        className="text-center text-2xl md:text-4xl font-bold text-gray-800 mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Read Before Travel
      </motion.h1>
      
      {/* First Section */}
      <motion.div 
        className="flex flex-col lg:flex-row items-center gap-8 p-6 bg-gray-100 rounded-xl rounded-b-none"
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        <motion.img
          src={cardImg}
          alt="Travel"
          className="w-full lg:w-[50%] rounded-xl shadow-xl object-cover aspect-video lg:aspect-auto"
          variants={imageVariants}
          whileHover="hover"
        />
        
        <motion.div 
          className="w-full lg:w-[50%]"
          variants={itemVariants}
        >
          <motion.h2 
            className="text-xl md:text-3xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Discover the world with us
          </motion.h2>
          
          <motion.p 
            className="text-gray-700 text-sm md:text-lg mb-6 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Explore amazing places and cultures. Join us in our adventures! 
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto
            esse necessitatibus deserunt libero quis repudiandae voluptas.
          </motion.p>
          
          <motion.a 
            className="text-blue-600 font-bold flex items-center hover:underline"
            href="#"
            variants={linkVariants}
            whileHover="hover"
          >
            <span>Learn More</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 ml-2"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z"
                clipRule="evenodd"
              />
            </svg>
          </motion.a>
        </motion.div>
      </motion.div>
      
      {/* Second Section */}
      <motion.div 
        className="flex flex-col lg:flex-row-reverse items-center gap-8 p-6 bg-gray-100 rounded-xl rounded-t-none shadow-lg"
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        <motion.img
          src={cardImg}
          alt="Travel"
          className="w-full lg:w-[50%] rounded-xl shadow-xl object-cover aspect-video lg:aspect-auto"
          variants={imageVariants}
          whileHover="hover"
        />
        
        <motion.div 
          className="w-full lg:w-[50%]"
          variants={itemVariants}
        >
          <motion.h2 
            className="text-xl md:text-3xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Plan your trip wisely
          </motion.h2>
          
          <motion.p 
            className="text-gray-700 text-sm md:text-lg mb-6 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Make sure you have everything sorted before traveling. Know your
            itinerary, pack smart, and be ready for an amazing journey!
          </motion.p>
          
          <motion.a 
            className="text-blue-600 font-bold flex items-center hover:underline"
            href="#"
            variants={linkVariants}
            whileHover="hover"
          >
            <span>Learn More</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 ml-2"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z"
                clipRule="evenodd"
              />
            </svg>
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ReadBefore;