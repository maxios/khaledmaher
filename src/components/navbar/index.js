import React from 'react';
import Link from 'gatsby-plugin-transition-link'

const Navbar = () => (
  <div className="navbar__container font-white font__RC-light">
    <ul className="d-flex">
      <Link to="/">
        <li className="navbar__item">Index</li>
      </Link>
      <Link to="/blog">
        <li className="navbar__item">Blog</li>
      </Link>
      <a href="https://drive.google.com/file/d/1JXbOtY8dl08_K39EfjjlXJ4Ou9IL-MxZ/view?usp=sharing" target="_blank">
        <li className="navbar__item">Resume</li>
      </a>
    </ul>
  </div>
)

export default Navbar;
