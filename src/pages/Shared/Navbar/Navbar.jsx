import { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { MdLogout, MdSpaceDashboard } from "react-icons/md";
import userImg from "/user.png";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { AuthContext } from "../../../Authproviders/AuthProviders";
import logo1 from "../../../assets/logo1.png";
import logo2 from "../../../assets/logo2.png";
import logo3 from "../../../assets/logo3.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logOut } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setIsScrolled(true);
      else setIsScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logOut();
    localStorage.removeItem("isDataSent");
  };

  const menu = (
    <>
      <li>
        <NavLink to="/" className={({ isActive }) => isActive ? "text-site-main font-bold" : "font-bold hover:text-site-main"}>Home</NavLink>
      </li>
      <li>
        <NavLink to="/tour" className={({ isActive }) => isActive ? "text-site-main font-bold" : "font-bold hover:text-site-main"}>Tour</NavLink>
      </li>
      <li>
        <NavLink to="/custom-tour" className={({ isActive }) => isActive ? "text-site-main font-bold" : "font-bold hover:text-site-main"}>Custom Tour</NavLink>
      </li>
      <li>
        <NavLink to="/group-tour" className={({ isActive }) => isActive ? "text-site-main font-bold" : "font-bold hover:text-site-main"}>Group Tour</NavLink>
      </li>
      <li>
        <NavLink to="/blogs-review" className={({ isActive }) => isActive ? "text-site-main font-bold" : "font-bold hover:text-site-main"}>Blogs & Review</NavLink>
      </li>
      <li>
        <NavLink to="/complain-form" className={({ isActive }) => isActive ? "text-site-main font-bold" : "font-bold hover:text-site-main"}>Complain</NavLink>
      </li>
    </>
  );

  return (
    <div
      className={`navbar px-5 w-full fixed top-0 left-0 z-20 transition-all duration-300 ${
        isScrolled ? "bg-white/80 text-black backdrop-blur-md shadow-md" : "bg-transparent text-white"
      }`}
    >
      {/* Left Section */}
      <div className="navbar-start">
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
            className="menu menu-sm dropdown-content absolute left-0 mt-3 z-50 p-2 bg-white text-black shadow-lg w-52 rounded-md"
          >
            {menu}
          </ul>
        </div>
        <div className="flex items-center gap-4">
          {/* <a className="normal-case font-extrabold text-2xl text-site-main">
            Desh Explorer
          </a> */}
          <img className="w-20" src={logo3} alt="" />
        </div>
      </div>

      {/* Center Navigation Links */}
      <div className="navbar-center hidden lg:flex">
        <ul className="flex gap-5 px-1 items-center">{menu}</ul>
      </div>

      {/* Right Section */}
      <div className="navbar-end">
        {user ? (
          <div className="flex items-center gap-4 text-black">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                {
                  user ? <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={user.photoURL || userImg} />
                </div> :
                <img src={userImg} />
                }
              </label>
              <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                <li className="text-center mb-2">{user.displayName}</li>
                <li>
                  <NavLink to='/userDashboard'>Dashboard <MdSpaceDashboard /></NavLink>
                </li>
                <li>
                  <button onClick={handleLogout} className="btn btn-ghost w-full font-semibold">Logout <MdLogout /></button>
                </li>
              </ul>
            </div>
            <button onClick={handleLogout} className="hover:text-site-main font-semibold">Logout</button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <img src={userImg} alt="user avatar" className="w-10 h-10 rounded-full" />
            <NavLink to="/login" className="hover:text-site-main font-semibold">
              Login
            </NavLink>
          </div>
        )} 
      </div>
    </div>
  );
};

export default Navbar;
