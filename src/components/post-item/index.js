import React from 'react';
import PropType from 'prop-types';
import ProgressiveImage from "react-progressive-graceful-image";
import AniLink from 'gatsby-plugin-transition-link/AniLink';
import * as timeago from 'timeago.js';
import '@utils/slugify.js';

const PostItem = ({data}) => {
  const heroThumbnailUrl = data.hero.formats.thumbnail.url;
  const heroUrl = process.env.NODE_ENV === 'production' ?
    data.hero.formats.medium.url :
    'https://www.designmantic.com/blog/wp-content/uploads/2016/07/social-media-cover-image-718x300.png'

  return (
    <div className="conatiner blogitem__container mb-4 d-flex flex-column flex-md-row">
      <div className="blogitem__hero mb-3">
        <AniLink fade duration={0.2} to={`/blog/${data.title.slugify('-')}`}>
          <ProgressiveImage
            delay={80}
            src={heroUrl}
            placeholder={heroThumbnailUrl}
          >
            {(src, loading) => <img alt={data.hero.caption} style={{opacity: loading ? 0 : 1}} src={src} className="blogitem__image" width={300} height={120}/> }
          </ProgressiveImage>
        </AniLink>
      </div>
      <div className="blogitem__content ml-0 ml-md-4">
        <AniLink fade duration={0.2} to={`/blog/${data.title.slugify('-')}`}>
          <div className="blogitem__title mb-3 ">
            <h2 className="font__title">{data.title}</h2>
            <br/>
            <span className="font__body"> {timeago.format(data.createdAt)} </span>
          </div>
        </AniLink>

        <div className="font__message blogitem__text">
          {data.content.substring(0, 300)}...
        </div>
      </div>
    </div>
  );
}

PostItem.propTypes = {
  data: PropType.any.isRequired
}

export default PostItem;
