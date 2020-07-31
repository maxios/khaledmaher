import React from 'react';
import PropType from 'prop-types';
import classnames from 'classnames';

import Image from '@images/photo.png';

const Photo = props => (
  <img
    src={Image}
    width={props.width}
    className={classnames('photo', props.className)}
  />
)

Photo.defaultProps = {
  width: 180,
  className: ''
}

Photo.propTypes = {
  width: PropType.number.isRequired,
  className: PropType.string
}

export default Photo;
