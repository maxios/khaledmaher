import React from 'react';
import Link from 'gatsby-plugin-transition-link'

const Navbar = () => (
  <div className="navbar__container font-white font__RC-light">
    <ul className="d-flex">
      <Link to="/blog">
        <li className="navbar__item">Blog</li>
      </Link>
      <li className="navbar__item">Pockets</li>
      <li className="navbar__item">Portfolio</li>
      <li className="navbar__item">Resume</li>
    </ul>
  </div>
)

export default Navbar;
