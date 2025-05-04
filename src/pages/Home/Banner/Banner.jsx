import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Banner = ({ bgImage, heading, text }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 0.5,
      transition: {
        duration: 1,
      },
    },
  };

  return (
    <div ref={ref}>
      <motion.div
        className="hero relative w-full min-h-[60vh] lg:min-h-[80vh] flex items-center justify-center bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
        initial="hidden"
        animate={controls}
      >
        {/* 🔥 Animated Dark Overlay */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-black"
          variants={overlayVariants}
        />

        {/* 🔥 Dynamic Heading & Text with Animations */}
        <motion.div
          className="hero-content flex flex-col justify-center items-center text-center z-10 px-4"
          variants={containerVariants}
        >
          <div className="max-w-full lg:max-w-3xl">
            <motion.h1
              className="mb-5 text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white drop-shadow-lg"
              variants={itemVariants}
            >
              {heading}
            </motion.h1>
            <motion.p
              className="mb-5 text-sm md:text-base lg:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              {text}
            </motion.p>
            
            {/* Optional CTA Button with Animation */}
            <motion.div variants={itemVariants}>
              <button className="mt-6 px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
                Learn More
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* 🔥 Animated Scrolling Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Banner;