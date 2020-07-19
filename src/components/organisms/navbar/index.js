import React from 'react';
import { Link } from 'gatsby';

const Navbar = () => {
  return (
    <nav className="level">
      <p className="level-item has-text-centered">
        <a className="link is-info">Home</a>
      </p>
      <p className="level-item has-text-centered">
        <Link to="/blog">blog</Link>
      </p>
      <p className="level-item has-text-centered">
        <a className="link is-info">Contact</a>
      </p>
    </nav>
  )
}

export default Navbar;
