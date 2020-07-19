import React from 'react'
import Photo from '@images/photo.png';
import LinkedinIcon from '@images/linkedin-icon.svg'
import GithubIcon from '@images/github-icon.svg'
import TwitterIcon from '@images/twitter-icon.svg'

const Sidebar = () => {
  const avatarDimension = 100;
  const iconDimension = 40;

  return (
    <div className="side_bar is-flex">
      <div className="side_bar_column is-centered is-inline-block">
        <img src={Photo} width={avatarDimension} className="avatar"/>
        <div className="side_bar_icons_container">
          <li className="side_bar_icon centered">
            <img src={LinkedinIcon} width={iconDimension} className="is-block block-centered"/>
          </li>
          <li className="side_bar_icon centered">
            <img src={GithubIcon} width={iconDimension} className="is-block block-centered"/>
          </li>
          <li className="side_bar_icon centered">
            <img src={TwitterIcon} width={iconDimension} className="is-block block-centered"/>
          </li>
        </div>
      </div>
      <div className="side_bar_right">
        <h1>Khaled Maher el prince</h1>
        <h2 className="is-roboto-regular subtitle--small">software engineer</h2>
      </div>
    </div>
  )
}

export default Sidebar;
