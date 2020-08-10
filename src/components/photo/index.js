import React from 'react';
import ProgressiveImage from "@components/progressive-image";
import PropType from 'prop-types';
import classnames from 'classnames';

const Photo = props => (
  <ProgressiveImage
    preview={props.preview || props.image}
    src={props.image}
    transitionTime={500}
    transitionFunction="ease"
    render={(src, style) => <img
      src={src}
      style={style}
      width={props.width}
      className={classnames('photo', props.className)}
    />
    }
  />
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
