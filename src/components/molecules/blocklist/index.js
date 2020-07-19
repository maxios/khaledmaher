import React from 'react';
import PropTypes from 'prop-types';
import Block from '@atoms/block';

const ListItem = props => (
  <div className="block-list-item col-12">
    {props.children}
  </div>
)

const BlockList = (props) => {
  console.log(props);
  return (
    <Block className="block-list">
      {
        props.children.map(Item => (
          <ListItem key={Item.key}>
            {Item}
          </ListItem>
        ))
      }
    </Block>
  )
}

BlockList.propTypes = {
  children: PropTypes.array.isRequired
}

ListItem.propTypes = {
  children: PropTypes.array.isRequired
}

export default BlockList;
