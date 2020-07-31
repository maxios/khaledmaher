import React from "react";
import Link from 'gatsby-plugin-transition-link';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-svg-core/styles.css'
import "@styles/index.scss";
import { config, library } from '@fortawesome/fontawesome-svg-core'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import Photo from '@components/photo';
import Layout from '@components/layout';

config.autoAddCss = false

library.add(faBars);

const IndexPage = () => {

  return (
    <div className="background font-white">
      <Layout>
        <div className="home__container">
          <div className="home__photo">
            <Photo width={180}/>
          </div>
          <div className="home__greetings text-centered">
            <h1 className="greetings font-white text-centered"> Hi </h1>
          </div>
          <div className="home__content d-flex flex-column flex-sm-row justify-content-center">
            <div className="home__choice text-centered">
              <Link to="/intro">
                <h2 className="font__RC-regular">Personal</h2>
              </Link>
              <ul>
                <li> Pockets </li>
                <li> Blog </li>
              </ul>
            </div>

            <div className="home__choice text-centered">
              <h2 className="font__RC-regular">Professional</h2>
              <ul>
                <li> Portfolio </li>
                <li> CV </li>
              </ul>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default IndexPage
