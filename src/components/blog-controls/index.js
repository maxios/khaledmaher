import React, { useState } from 'react';
import PropType from 'prop-types';
import AniLink from 'gatsby-plugin-transition-link/AniLink';
import Link from 'gatsby-plugin-transition-link';
import Slugify from 'slugify';
import ArrowIcon from '@images/icons/arrow.svg';
import ShareIcon from '@images/icons/share.svg';
import ListIcon from '@images/icons/list.svg';
import SVG from '@components/svg';
import Sharer from '@components/sharer';


const BlogControls = ({ pageContext, location }) => {
  const [shareOpened, setShareOpened] = useState(false);
  const next = pageContext.next;
  const prev = pageContext.prev;

  const toggleSharers = () => setShareOpened(!shareOpened);
  const closeSharers = () => setShareOpened(false);

  return (
    <>
      <Sharer
        location={location}
        isOpened={shareOpened}
        close={closeSharers}
      />
      <div
        className="postTemplate__controls-container d-flex align-items-end align-items-md-center z-index-5 "
      >
        <div className="d-flex flex-row flex-md-column justify-content-center absolute left col-12 p-0">
          <Link className="postTemplate__controls-button order-2 order-md-1" to={`/blog`}>
            <SVG id={ListIcon.id} size={50} color="white"/>
          </Link>
          {
            prev ? (
              <AniLink
                cover bg="#663399"
                direction="left"
                className="postTemplate__controls-button order-1 order-md-2"
                to={`/blog/${Slugify(prev)}`}
              >
                <SVG id={ArrowIcon.id} size={50} color="white" inverse/>
              </AniLink>
            ) : (
              <div className="postTemplate__controls-button dimmed order-1 order-md-2">
                <SVG id={ArrowIcon.id} size={50} color="white" inverse/>
              </div>
            )
          }

          <button
            className="postTemplate__controls-button order-3 z-index-2"
            onClick={toggleSharers}
          >
            <SVG id={ShareIcon.id} size={30} color="white"/>
          </button>

          {
            next ? (
              <AniLink
                cover bg="#663399"
                direction="right"
                className="postTemplate__controls-button absolute-tablet right order-4"
                to={`/blog/${Slugify(next)}`}
              >
                <SVG id={ArrowIcon.id} size={50} color="white"/>
              </AniLink>
            ) : (
              <div className="postTemplate__controls-button dimmed absolute-tablet right order-4">
                <SVG id={ArrowIcon.id} size={50} color="white"/>
              </div>
            )
          }

        </div>
      </div>
    </>
  )
}

BlogControls.propTypes = {
  pageContext: PropType.object.isRequired,
  location: PropType.object.isRequired
}

export default BlogControls;
