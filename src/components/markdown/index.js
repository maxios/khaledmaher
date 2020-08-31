import React, {useEffect} from 'react';
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
  }[name] || <div/>
}

const Markdown = props => {
  const { body, ...restProps } = props;

  useEffect(() => {
    var e = document.getElementById('react-markdown');

    if(!e) return;

    const props = JSON.parse(e.dataset.props);
    const div = document.createElement('div');
    ReactDOM.render(components(e.dataset.component, props), div)
    e.parentNode.replaceChild( div, e);
  }, [])

  return (
    <ReactMarkdown escapeHtml={false} source={body} {...restProps}/>
  )
}

Markdown.propTypes = {
  body: PropType.string.isRequired   // Markdown post containing the react-div
}

export default Markdown;
