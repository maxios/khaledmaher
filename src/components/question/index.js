import React from 'react';
import PropType from 'prop-types';
import InlineModal from '@components/inline-modal';

class Question extends React.Component {
  constructor(props) {
    super(props)

    this.inputRef = React.createRef();
    this.state = {
      isModalOpened: null
    }
  }

  onOpen() {
    this.inputRef.current.focus();
  }

  close() {
    this.setState({isModalOpened: false})
  }

  render() {
    return (
      <InlineModal toggle={this.state.isModalOpened} onOpen={this.onOpen.bind(this)}>
        <div className="question__container">
          <div className="question__group">
            <p className="question__text">{this.props.text}</p>
            <input ref={this.inputRef} className="question__input"/>
          </div>
          <button onClick={this.close.bind(this)}>{this.props.buttonText}</button>
        </div>
      </InlineModal>
    )
  }
}

Question.defaultProps = {
  buttonText: 'Submit'
}

Question.propTypes = {
  text: PropType.string.isRequired,
  buttonText: PropType.string
}

export default Question;
