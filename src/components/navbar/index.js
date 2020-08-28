import React from 'react';
import AniLink from 'gatsby-plugin-transition-link/AniLink'
import { Link } from 'gatsby';

const Navbar = () => (
  <div className="navbar__container font__RC-light">
    <ul className="navbar__list d-flex">
      <Link fade to="/">
        <li className="navbar__item">Index</li>
      </Link>
      <AniLink fade to="/blog">
        <li className="navbar__item">Blog</li>
      </AniLink>
      <a href="https://drive.google.com/file/d/1JXbOtY8dl08_K39EfjjlXJ4Ou9IL-MxZ/view?usp=sharing" target="_blank" rel="noreferrer">
        <li className="navbar__item">Resume</li>
      </a>
    </ul>
  </div>
)

export default Navbar;
