import React from 'react';
import PropType from 'prop-types';
import Image from '@images/photo.png';

const Photo = props => (
  <img
    src={Image}
    width={props.width}
    className="photo"
  />
)

Photo.propTypes = {
  width: PropType.number.isRequired
}

export default Photo;
