import React from 'react';
import ProgressiveImage from "react-progressive-graceful-image";
import PropType from 'prop-types';
import classnames from 'classnames';

const Photo = props => (
  <ProgressiveImage
    preview={props.preview || props.image}
    src={props.image}
  >
    {
      (src, loading) => <img
        src={src}
        width={props.width}
        className={classnames('photo', props.className)}
        style={{opacity: loading ? 0 : 1}}
        alt="photo image"
      />
    }

  </ProgressiveImage>
)

Photo.defaultProps = {
  width: 180,
  className: '',
  image: '',
  preview: ''
}

Photo.propTypes = {
  width: PropType.number.isRequired,
  className: PropType.string,
  image: PropType.String,
  preview: PropType.string
}

export default Photo;
