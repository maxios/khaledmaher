import React from 'react';

const ImageRenderer = props => {
  return (
    <span className="markdown__image-container">
      <img {...props}/>
    </span>
  )
}

export default ImageRenderer;
