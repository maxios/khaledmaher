import React from 'react';
import SVG from '@components/svg';
import TwitterIcon from '@images/icons/twitter.svg';
import LinkedinIcon from '@images/icons/linkedin.svg';
import GithubIcon from '@images/icons/github.svg';

const Footer = () => (
  <div className="footer__container d-flex flex-column justify-content-center">
    <div className="footer__social d-flex justify-content-center">
      <div className="footer__social-icon pointer">
        <a target="_blank" rel="noreferrer" href="https://twitter.com/_khaledmaher_">
          <SVG id={TwitterIcon.id} size={20} color="#9BA6BF"/>
        </a>
      </div>

      <div className="footer__social-icon pointer">
        <a target="_blank" rel="noreferrer" href="https://linkedin.com/in/khaledmaher">
          <SVG id={LinkedinIcon.id} size={20} color="#9BA6BF"/>
        </a>
      </div>

      <div className="footer__social-icon pointer">
        <a target="_blank" rel="noreferrer" href="https://github.com/maxios">
          <SVG id={GithubIcon.id} size={20} color="#9BA6BF"/>
        </a>
      </div>
    </div>
    <div className="footer__copyright font__RC-light text-centered">
      <p className="text-unselectable">
        © khaled maher
      </p>
    </div>
  </div>
)

export default Footer;
