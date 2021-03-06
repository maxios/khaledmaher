import React, {useEffect} from 'react';
import PropType from 'prop-types';

const Typeform = props => {
  const style = {
    fontFamily: 'Sans-Serif',
    fontSize: 12,
    color: '#999',
    opacity: 0.5,
    paddingTop: 5
  }
  useEffect(() => {
    fetch('https://embed.typeform.com/embed.js')
      .then(response => {
        console.log(response);
        response.text()
      })
      .then(Function)
      .then(() => props.callback && props.callback())
      .catch(console.log)
  }, [])

  return (
    <>
      <div className="typeform-widget" data-url="https://form.typeform.com/to/FOASbG" style={{width: '100%', height: 500}}></div>
      <div style={style}> powered by <a href="https://admin.typeform.com/signup?utm_campaign=FOASbG&utm_source=typeform.com-01D8JWZT6EG6NTBMRT0NRMW8MH-free&utm_medium=typeform&utm_content=typeform-embedded-poweredbytypeform&utm_term=EN" style={{color: '#999'}} target="_blank" rel="noreferrer">Typeform</a> </div>
    </>
  )
}

Typeform.defaultProps = {
  callback: () => {}
}

Typeform.propTypes = {
  callback: PropType.func
}

export default Typeform;
