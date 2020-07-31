import React from "react";

import "@styles/index.scss";
import { config, library } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import 'bootstrap/dist/css/bootstrap.min.css';
import Photo from '@components/photo';

config.autoAddCss = false

library.add(faBars);

const IndexPage = () => {

  return (
    <div className="background">
      <div className="home__container">
        <div className="home__photo">
          <Photo width={180}/>
        </div>
        <div className="home__greetings">
          <h1 className="greetings font-white text-centered"> Hi </h1>
        </div>
      </div>
    </div>
  )
}

export default IndexPage
