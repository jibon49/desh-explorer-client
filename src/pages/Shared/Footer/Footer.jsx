import React, { PureComponent } from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export class Footer extends PureComponent {
  render() {
    return (
      <div className='text-[#292D32]'>
        <footer className="footer sm:footer-horizontal bg-base-200 text-base-content p-10">
  <nav>
    <h6 className="footer-title">Stay Connected</h6>
    <a className="link link-hover">Branding</a>
    <a className="link link-hover">Design</a>
    <a className="link link-hover">Marketing</a>
    <a className="link link-hover">Advertisement</a>
  </nav>
  <nav>
    <h6 className="footer-title">Desh Explorer</h6>
    <a className="link link-hover">About us</a>
    <a className="link link-hover">Contact</a>
    <a className="link link-hover">Jobs</a>
    <a className="link link-hover">Press kit</a>
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
    <h5>Get updated news and offers</h5>
    <fieldset className="w-80">
      <label>Enter your email address</label>
      <div className="join">
        <input
          type="text"
          placeholder="username@site.com"
          className="input input-bordered join-item" />
        <button className="btn btn-primary join-item">Subscribe</button>
      </div>
    </fieldset>
  </form>
</footer>
<footer className="footer sm:footer-horizontal footer-center bg-[#292D32] text-base-content p-4 text-white">
  <aside>
    <p>Copyright © {new Date().getFullYear()} - All right reserved by Desh Explorer</p>
  </aside>
</footer>
      </div>
    )
  }
}

export default Footer