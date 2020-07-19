import React from 'react';
import PropTypes from 'prop-types';
import Block from '@atoms/block';

const MainBlock = ({children}) => {
  return (
    <Block className="main-block">
      {children}
    </Block>
  )
}

MainBlock.propTypes = {
  children: PropTypes.any.isRequired
};

export default MainBlock;
