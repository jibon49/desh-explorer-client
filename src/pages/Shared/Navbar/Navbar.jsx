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

  const menu = <>
  <li>
              <NavLink to="/" className="font-bold hover:text-site-main">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/tour" className="font-bold hover:text-site-main">
                Tour
              </NavLink>
            </li>
            <li>
              <NavLink to="/custom-tour" className="font-bold hover:text-site-main">
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
                Blogs & Review
              </NavLink>
            </li>
            <li>
              <NavLink to="/" className="font-bold hover:text-site-main">
                Complain
              </NavLink>
            </li>
  </>

  return (
    <div
      className={`navbar px-5 w-full fixed top-0 left-0 z-20 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 text-black backdrop-blur-md shadow-md"
          : "bg-transparent text-white"
      }`}
    >
      {/* Left Section - Logo & Mobile Menu */}
      <div className="navbar-start text-black">
        <div className="dropdown relative">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
            className="menu menu-sm dropdown-content absolute left-0 mt-3 z-50 p-2 bg-white shadow-lg w-52 rounded-md"
          >
            {menu}
          </ul>
        </div>

        <div className="flex items-center gap-4">
          {/* <img className="h-12" alt="Logo" /> */}
          <a className="normal-case font-extrabold text-2xl text-site-main">
            Desh Explorer
          </a>
        </div>
      </div>

      {/* Center Navigation Links */}
      <div className="navbar-center hidden lg:flex">
        <ul className="flex gap-5 px-1">
          {menu}
        </ul>
      </div>

      {/* Right Section - Login Button */}
      <div className="navbar-end">
        <NavLink
          to="/login"
          className="hover:bg-site-main bg-site-main bg-base-200 px-6 py-2 rounded-xl font-semibold"
        >
          Login
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
