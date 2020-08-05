import React from 'react';
import PropType from 'prop-types';
import * as timeago from 'timeago.js';

const PostItem = ({data}) => {
  return (
    <div className="conatiner mt-4 d-flex blogitem__container">
      <div className="blogitem__hero">
        <img src={data.hero.url} width={300} height={120}/>
      </div>
      <div className="ml-4 blogitem__content">
        <div className="font__title mb-3 blogitem__title">
          {data.title}
          <br/>
          <span className="font__body"> {timeago.format(data.createdAt)} </span>
        </div>

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
