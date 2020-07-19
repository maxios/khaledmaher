import React from "react";

import "@styles/index.scss";
import { config, library } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import 'bootstrap/dist/css/bootstrap.min.css';
import Photo from '@images/photo.png';
import Navbar from '@organisms/navbar';
import CornerMenu from '@organisms/corner_menu';

config.autoAddCss = false

library.add(faBars);

const IndexPage = () => {
  const avatarDimension = 200;

  return (
    <div>
      <Navbar/>
      <img src={Photo} width={avatarDimension} className="avatar"/>
      <h1 className="greetings"> Hello, 👋 </h1>
      <CornerMenu/>
    </div>
  )
}

export default IndexPage
