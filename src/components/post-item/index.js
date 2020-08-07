import React from 'react';
import PropType from 'prop-types';
import Link from 'gatsby-plugin-transition-link';
import Slugify from 'slugify';
import * as timeago from 'timeago.js';

const PostItem = ({data}) => {
  const heroUrl = process.env.production ?
    data.hero.url :
    'https://www.designmantic.com/blog/wp-content/uploads/2016/07/social-media-cover-image-718x300.png'

  return (
    <div className="conatiner blogitem__container mb-4 d-flex flex-column flex-md-row">
      <div className="blogitem__hero mb-3">
        <Link to={`/blog/${Slugify(data.title)}`}>
          <img className="blogitem__image" src={heroUrl} width={300} height={120}/>
        </Link>
      </div>
      <div className="blogitem__content ml-0 ml-md-4">
        <Link to={`/blog/${Slugify(data.title)}`}>
          <div className="blogitem__title mb-3 ">
            <h2 className="font__title">{data.title}</h2>
            <br/>
            <span className="font__body"> {timeago.format(data.createdAt)} </span>
          </div>
        </Link>

        <div className="font__message blogitem__text">
          {data.content.substring(0, 500)}...
        </div>
      </div>
    </div>
  );
}

PostItem.propTypes = {
  data: PropType.any.isRequired
}

export default PostItem;
