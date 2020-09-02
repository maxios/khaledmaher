import React from 'react';
import PropType from 'prop-types';

const Modal = props => {
  return (
    <div
      className="modal__background transition-ease-out full-screen"
      onClick={props.close}
      style={props.isOpened ? {
        opacity: 1,
          pointerEvents: 'initial'
      } : {
        opacity: 0,
        pointerEvents: 'none'
      }}
    >
      {props.children}
    </div>
  )
}

Modal.propTypes = {
  close: PropType.func.isRequired,
  isOpened: PropType.bool.isRequired,
  children: PropType.any.isRequired
}

export default Modal;
