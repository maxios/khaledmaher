import React from 'react';
import Link from 'gatsby-plugin-transition-link';

import Layout from '@components/layout';
import Photo from '@components/photo';
import SVG from '@components/svg';
import TwitterIcon from '@images/icons/twitter.svg';
import LinkedinIcon from '@images/icons/linkedin.svg';
import GithubIcon from '@images/icons/github.svg';

const IntroPage = () => {
  return (
    <Layout>
      <div className="intro__header">
      </div>
      <div className="intro__content d-flex justify-content-sm-center">
        <div className="intro__photo-container d-flex flex-column justify-content-center">

          {/* profile picture */}
          <div className="d-flex justify-content-center">
            <Photo className="intro__photo"/>
          </div>
          <div className="mt-2 intro__social d-flex justify-content-center">
            <div className="ml-4 mr-4 icon pointer">
              <a target="_blank" rel="noreferrer" href="https://twitter.com/animaxios">
                <SVG id={TwitterIcon.id} size={50} color="#272E40"/>
              </a>
            </div>

            <div className="ml-4 mr-4 icon pointer">
              <a target="_blank" rel="noreferrer" href="https://linkedin.com/in/khaledmaher">
                <SVG id={LinkedinIcon.id} size={50} color="#272E40"/>
              </a>
            </div>

            <div className="ml-4 mr-4 icon pointer">
              <a target="_blank" rel="noreferrer" href="https://github.com/maxios">
                <SVG id={GithubIcon.id} size={50} color="#272E40"/>
              </a>
            </div>
          </div>
        </div>

        {/* content message */}
        <div className="container row">
          <section className="intro__message col-md-8 col-sm-12">
            <h1 className="font__title--big">
              Hi there!, I’m <span className="font__R-medium">Khaled Maher</span>
            </h1>

            <p className="pt-5 pr-3 font__message">
              A young software engineering fellow. love to discover new patterns in life in legacy thoughts in order to freshen the discussions.
              Happy to share my thoughts at my personal <Link to="/blog">blogs</Link>. check it out.

              Please get in touch or just say Hi. I always have time to connect.
            </p>
          </section>

          <section className="mt-5 intro__posts col-md-4 col-sm-12">
            <h2 className="font__title mb-5"> Recent Posts </h2>

            <h3 className="font__title">The mental models of the thoughts</h3>
            <p className="font__body">20 July, 2020 - 08:00 AM</p>
          </section>
        </div>

      </div>
    </Layout>
  )
}

export default IntroPage
