import React from 'react';
import PropType from 'prop-types';

const BtnIcon = ({children}) => {
  return (
    <div className="social-btns">
      <a className="btn facebook" href="#">
        {children}
      </a>
    </div>
  )
}

BtnIcon.propTypes = {
  children: PropType.any.isRequired
}

export default BtnIcon;
