import React from 'react';
import PropType from 'prop-types';

const SVG = ({ color, size, id, inverse }) => {
  return (
    <svg style={{width: size, height: size, fill: color, transform: inverse ? 'rotate(180deg)' : 'initial'}}>
      <use xlinkHref={`#${id}`} />
    </svg>
  )
}

SVG.defaultProps = {
  size: 30,
  color: '',
  inverse: false
}

SVG.propTypes = {
  id: PropType.any.isRequired,
  size: PropType.number,
  color: PropType.string,
  inverse: PropType.bool
}

export default SVG;
