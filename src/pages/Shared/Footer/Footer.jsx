import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="footer sm:footer-horizontal bg-base-200 text-base-content p-10">
        <nav>
          <h6 className="footer-title">Stay Connected</h6>
          <a href="#" className="link link-hover">Branding</a>
          <a href="#" className="link link-hover">Design</a>
          <a href="#" className="link link-hover">Marketing</a>
          <a href="#" className="link link-hover">Advertisement</a>
        </nav>
        <nav>
          <h6 className="footer-title">Desh Explorer</h6>
          <NavLink
            to="/aboutus"
            className={({ isActive }) =>
              isActive ? "text-site-main font-bold" : "font-bold hover:text-site-main"
            }
          >
            About Us
          </NavLink>
          <a href="#" className="link link-hover">Contact</a>
          <a href="#" className="link link-hover">Jobs</a>
          <a href="#" className="link link-hover">Press kit</a>
        </nav>
        <nav>
          <h6 className="footer-title">Social Media</h6>
          <div className="flex space-x-4">
            <a href="https://facebook.com" className="link link-hover">
              <FaFacebook className="text-blue-600 h-6 w-6" />
            </a>
            <a href="https://twitter.com" className="link link-hover">
              <FaTwitter className="text-blue-400 h-6 w-6" />
            </a>
            <a href="https://instagram.com" className="link link-hover">
              <FaInstagram className="text-pink-500 h-6 w-6" />
            </a>
            <a href="https://linkedin.com" className="link link-hover">
              <FaLinkedin className="text-blue-700 h-6 w-6" />
            </a>
          </div>
        </nav>
        <form>
          <h6 className="footer-title">Newsletter</h6>
          <p>Get updated news and offers</p>
          <fieldset className="w-80">
            <label htmlFor="newsletter-email">Enter your email address</label>
            <div className="join">
              <input
                id="newsletter-email"
                type="email"
                placeholder="username@site.com"
                className="input input-bordered join-item"
              />
              <button type="submit" className="btn btn-primary join-item">Subscribe</button>
            </div>
          </fieldset>
        </form>
      </div>
      <div className="footer sm:footer-horizontal footer-center bg-[#292D32] text-base-content p-4">
        <aside>
          <p className='text-white'>&copy; {new Date().getFullYear()} - All rights reserved by Desh Explorer</p>
        </aside>
      </div>
    </footer>
  );
};

export default Footer;