import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const Block = ({ style, className, children }) => {
  return (
    <div style={style} className={classnames("block", className)}>
      {children}
    </div>
  )
}

Block.defaultProps = {
  className: '',
  style: {}
}

Block.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any.isRequired,
  style: PropTypes.obj
}

export default Block;
