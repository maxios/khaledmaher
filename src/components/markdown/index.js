import React, {useEffect, useRef} from 'react';
import PropType from 'prop-types';
import ReactDOM from 'react-dom';
import Question from '@components/question';
import ReactMarkdown from 'react-markdown';
import ImageRenderer from './renderers/image.js';

// matches strings like
// <a id="react-markdown" data-component='typeform' data-props='{"key": "value"}' >     </div>
// Make sure to use SINGLE quotes for defining HTML attributes,
// as we need double quotes to parse the JSON props attribute

// components function map to the matching react component
const components = (name, props) => {
  return {
    question: <div id="question-root"><Question {...props}></Question></div>
  }[name] || <span/>
}

const Markdown = props => {
  const { body, ...restProps } = props;
  const containerRef = useRef(null);

  useEffect(() => {
    const nodes = containerRef.current.querySelectorAll('[data-id="react"]');

    if(!nodes.length) return;

    nodes.forEach(node => {
      const props = JSON.parse(node.dataset.props);
      const div = document.createElement('div');
      const parent = node.parentNode.parentNode;
      ReactDOM.render(components(node.dataset.component, props), div)
      parent.parentNode.replaceChild(div, parent);
    })
  }, [])

  return (
    <div ref={containerRef} className="markdown__container">
      <ReactMarkdown
        escapeHtml={false}
        source={body} {...restProps}
        renderers={{image: ImageRenderer}}
      />
    </div>
  )
}

Markdown.propTypes = {
  body: PropType.string.isRequired   // Markdown post containing the react-div
}

export default Markdown;
