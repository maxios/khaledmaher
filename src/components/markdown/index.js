import React, {useEffect, useRef} from 'react';
import PropType from 'prop-types';
import ReactDOM from 'react-dom';
import Typeform from '@components/typeform';
import ReactMarkdown from 'react-markdown';

// matches strings like
// <a id="react-markdown" data-component='typeform' data-props='{"key": "value"}' >     </div>
// Make sure to use SINGLE quotes for defining HTML attributes,
// as we need double quotes to parse the JSON props attribute

// components function map to the matching react component
const components = (name, props) => {
  return {
    typeform: <Typeform {...props}></Typeform>
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
      ReactDOM.render(components(node.dataset.component, props), div)
      node.parentNode.replaceChild(div, node);
    })
  }, [])

  return (
    <div ref={containerRef} className="markdown__container">
      <ReactMarkdown escapeHtml={false} source={body} {...restProps}/>
    </div>
  )
}

Markdown.propTypes = {
  body: PropType.string.isRequired   // Markdown post containing the react-div
}

export default Markdown;
