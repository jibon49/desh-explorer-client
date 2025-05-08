import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import discoverImg from "./../../../assets/banner3.jpg";

const Discover = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
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

  const imageVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const textVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: 0.4,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  return (
    <div ref={ref} className="bg-base-200 p-6 my-5 overflow-hidden">
      <motion.div
        className="hero-content flex-col lg:flex-row gap-6 lg:gap-12 max-w-7xl mx-auto"
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        {/* Left - Animated Image */}
        <motion.img
          src={discoverImg}
          className="lg:w-1/2 w-full rounded-lg shadow-2xl object-cover aspect-video lg:aspect-auto"
          alt="Discover Image"
          variants={imageVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        />

        {/* Right - Animated Text & Button */}
        <motion.div
          className="lg:w-1/2 w-full text-justify"
          variants={textVariants}
        >
          <motion.h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 text-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Discover the world with us
          </motion.h1>
          
          <motion.p
            className="text-lg leading-relaxed md:leading-loose text-gray-700 mb-6 lg:mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Explore amazing places and cultures. Join us in our adventures! Lorem ipsum dolor sit
            amet consectetur adipisicing elit. Architecto esse necessitatibus deserunt libero quis
            repudiandae voluptas, odio nulla officia praesentium, et fugit nihil eveniet voluptatibus
            amet assumenda ut quibusdam quam.
          </motion.p>

          <motion.button
            className="btn mt-5 px-8 py-4 bg-site-main hover:bg-site-main-dark text-white rounded-full text-lg font-semibold shadow-lg"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Download Guide Book
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Discover;