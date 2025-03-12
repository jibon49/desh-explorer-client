import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`navbar px-5 w-full fixed top-0 left-0 z-20 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 text-black backdrop-blur-md shadow-md"
          : "bg-transparent text-white"
      }`}
    >
      {/* Left Section - Logo */}
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu-sm dropdown-content text-[#363636] mt-3 z-[1] p-2 bg-base-100 w-52"
          >
            {/* Navigation Links */}
          </ul>
        </div>
        <div className="flex items-center gap-4">
          <img className="h-12" />
          <a className="normal-case font-extrabold text-xl text-site-main">
            Desh Travel
          </a>
        </div>
      </div>

      {/* Center Navigation Links */}
      <div className="navbar-center hidden lg:flex">
        <ul className="flex gap-5 px-1">
          <li>
            <NavLink to="/" className="font-bold hover:text-site-main">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/" className="font-bold hover:text-site-main">
              Tour
            </NavLink>
          </li>
          <li>
            <NavLink to="/" className="font-bold hover:text-site-main">
              Custom Tour
            </NavLink>
          </li>
          <li>
            <NavLink to="/" className="font-bold hover:text-site-main">
              Group Tour
            </NavLink>
          </li>
          <li>
            <NavLink to="/" className="font-bold hover:text-site-main">
              Blogs & review
            </NavLink>
          </li>
          <li>
            <NavLink to="/" className="font-bold hover:text-site-main">
              Complain
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Right Section - Login Button */}
      <div className="navbar-end">
        <NavLink
          to="/login"
          className="hover:bg-site-main hover:text-white bg-base-200 px-6 py-2 rounded-xl font-semibold"
        >
          Login
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
