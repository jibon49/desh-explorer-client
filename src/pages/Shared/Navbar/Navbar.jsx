import { NavLink } from "react-router-dom";

const Navbar = () => {
  const navOptions = (
    <>
      <li>
        <NavLink to="/" className="hover:text-site-main">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/" className="hover:text-site-main">
          Tour
        </NavLink>
      </li>
      <li>
        <NavLink to="/" className="hover:text-site-main">
          Custom Tour
        </NavLink>
      </li>
      <li>
        <NavLink to="/" className="hover:text-site-main">
          Group Tour
        </NavLink>
      </li>
      <li>
        <NavLink to="/" className="hover:text-site-main">
          Blogs & review
        </NavLink>
      </li>
      <li>
        <NavLink to="/" className="hover:text-site-main">
          Complain
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="navbar px-5 sticky top-0 glass z-10">
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
            {navOptions}
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
          {navOptions}
        </ul>
      </div>

      {/* Right Section - Placeholder for Login/Signup (if needed) */}
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
