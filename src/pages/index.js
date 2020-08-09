import React from "react";
import AniLink from 'gatsby-plugin-transition-link/AniLink';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-svg-core/styles.css'
import "@styles/index.scss";
import { config, library } from '@fortawesome/fontawesome-svg-core'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import Photo from '@components/photo';
import Layout from '@components/layout';
import Image from '@images/photo.png';

config.autoAddCss = false

library.add(faBars);

const IndexPage = () => {

  const description = `
  Dedicated Software Engineer experienced in crafting software products using various stacks alongside with AWS Services.
  I assure the best performance, Code Readability, and fast delivery.
  `

  return (
    <div className="background font-white">
      <Layout seo={{title: 'Khaled Maher | Software Engineer', description, image: Image}}>
        <div className="home__container">
          <div className="home__photo">
            <Photo image={Image} width={180}/>
          </div>
          <div className="home__greetings text-centered">
            <h1 className="greetings font-white text-centered"> Hi </h1>
            <br/>
            <p className="p-4 font__message">
              {description}
              <br/> happy to <AniLink swipe direction="up" className="font__link" to="/blog"> check my Blog </AniLink>
            </p>

            <br/>
            <p className="font__RC-regular">contact me at: khaled.mailhub@gmail.com</p>
          </div>
    {/*
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
          */}
        </div>
      </Layout>
    </div>
  )
}

export default IndexPage
