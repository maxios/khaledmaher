import React from 'react';
import PropType from 'prop-types';

const ImageRenderer = props => {
  const { src } = props;

  return (
    <span className="markdown__image-container"
      style={{
        background: `radial-gradient(white, rgb(255 255 255 / 95%), white), url(${src})`
      }}
    >
      <img {...props}/>
    </span>
  )
}

ImageRenderer.propTypes = {
  src: PropType.string.isRequired
}

export default ImageRenderer;
