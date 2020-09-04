import React from 'react';
import PropType from 'prop-types';
import { throttle } from '@utils/function.js';

class InlineModal extends React.Component {
  constructor(props) {
    super(props)

    this.containerRef = React.createRef();
    this.inputRef = React.createRef();
    this.state = {
      isOpened: this.props.opened,
      closed: false
    };
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (prevProps.toggle !== this.props.toggle){
      this.setState({ isOpened: this.props.toggle })
    }
  }

  show() {
    console.log('a;slkdjfals;df')
    const doc = document.documentElement;
    if (doc.scrollTop > this.containerRef.current.offsetTop - (doc.clientHeight - doc.clientHeight/3)) {
      this.setState({isOpened: true})
      window.removeEventListener('scroll', this.throttleScroll)
      this.props.onOpen();
    }
  }

  throttleScroll = throttle(this.show.bind(this), this.props.throttle);

  end() {
    this.setState({closed: true})
  }

  close() {
    this.setState({isOpened: false})
  }

  componentDidMount() {
    if (typeof window !== undefined) {
      window.addEventListener('scroll', this.throttleScroll)
    }
  }

  render() {
    return (
      <div
        ref={this.containerRef}
        className="inline-modal__container transition-ease-out-half"
        style={{maxHeight: this.state.isOpened ? this.props.height : 0}}
      >
        {this.props.children}
      </div>
    )
  }
}

InlineModal.defaultProps = {
  opened: false,
  onOpen: () => {},
  toggle: () => {},
  height: 600,
  throttle: 500
}

InlineModal.propTypes = {
  children: PropType.any.isRequired,
  toggle: PropType.bool,
  throttle: PropType.number,
  height: PropType.number,
  opened: PropType.bool,
  onOpen: PropType.func
}

export default InlineModal;
