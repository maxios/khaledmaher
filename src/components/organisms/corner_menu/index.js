import React from "react";

import "@styles/index.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { config, library } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import 'bootstrap/dist/css/bootstrap.min.css';
import LinkedinIcon from '@images/linkedin-icon.svg'
import GithubIcon from '@images/github-icon.svg'
import TwitterIcon from '@images/twitter-icon.svg'
import BtnIcon from '@atoms/btn-icon';

config.autoAddCss = false

library.add(faBars);

const CornerMenu = () => {
  const iconDimension = 40

  return (
    <div className="corner_menu">
      <div className="corner_menu_icon">
        <FontAwesomeIcon style={{width: 40, height: 40}} icon={faBars} />
      </div>

      <div className="side_bar_icons_container">
        <li className="side_bar_icon centered">
          <BtnIcon>
            <img src={LinkedinIcon} width={iconDimension} className="fa"/>
          </BtnIcon>
        </li>
        <li className="side_bar_icon centered">
          <BtnIcon>
            <img src={GithubIcon} width={iconDimension} className="fa"/>
          </BtnIcon>
        </li>
        <li className="side_bar_icon centered">
          <BtnIcon>
            <img src={TwitterIcon} width={iconDimension} className="fa"/>
          </BtnIcon>
        </li>
      </div>
    </div>
  )
}

export default CornerMenu;
