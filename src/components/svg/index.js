import React from 'react';
import PropType from 'prop-types';

const SVG = ({ color, size, id }) => {
  return (
    <svg style={{width: size, height: size, fill: color}}>
      <use xlinkHref={`#${id}`} />
    </svg>
  )
}

SVG.defaultProps = {
  size: 30,
  color: ''
}

SVG.propTypes = {
  id: PropType.any.isRequired,
  size: PropType.number,
  color: PropType.string
}

export default SVG;
