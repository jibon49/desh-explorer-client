import React from "react";
import { FaCode, FaPalette, FaTasks, FaFileAlt, FaUserTie, FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";
import Banner from "../Home/Banner/Banner";
import backImage from "../../assets/tourbg.jpg";

const teamMembers = [
  {
    name: "Moinul Islam Jibon",
    role: "Full Stack Developer",
    description: "Responsible for backend and frontend integration, API design, and database management.",
    icon: <FaCode className="text-blue-500" />,
    color: "bg-blue-50"
  },
  {
    name: "Syed Raiyan Nasim",
    role: "Frontend Developer & UI/UX Designer, Project Manager",
    description: "Leads frontend development, designs user interfaces, and manages the overall progress of the project.",
    icon: <FaPalette className="text-purple-500" />,
    color: "bg-purple-50"
  },
  {
    name: "Anik Kumar Haldar",
    role: "Documenter, Designer, Assistant Project Manager",
    description: "Handles all documentation, supports design tasks, and assists in project coordination.",
    icon: <FaFileAlt className="text-green-500" />,
    color: "bg-green-50"
  },
];

const AboutUs = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <>
      <Banner
        bgImage={backImage}
        heading="About Us"
        text="Learn more about our passionate team of professionals."
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-6 py-16">
        <motion.div 
          className="max-w-6xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
              whileHover={{ scale: 1.02 }}
            >
              About Our Team
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
              whileHover={{ scale: 1.01 }}
            >
              We are a passionate team dedicated to building modern, scalable, and user-friendly software solutions. Each of us brings unique skills to ensure project success.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.03 }}
                className={`${member.color} p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300`}
              >
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-full bg-white shadow-md mr-4">
                    {member.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{member.name}</h2>
                    <h3 className="text-sm font-medium text-gray-600">{member.role}</h3>
                  </div>
                </div>
                <p className="text-gray-700">{member.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            variants={itemVariants}
            className="mt-16 bg-white p-8 rounded-xl shadow-md"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-6 md:mb-0 md:mr-8">
                <div className="p-4 bg-blue-100 rounded-full inline-block">
                  <FaUsers className="text-blue-600 text-4xl" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Team Culture</h2>
                <p className="text-gray-700">
                  We believe in collaboration, continuous learning, and creating solutions that make a difference. 
                  Our team combines technical expertise with creative problem-solving to deliver exceptional results.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default AboutUs;