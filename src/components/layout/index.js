import React from 'react';
import PropType from 'prop-types';
import { Helmet } from 'react-helmet';
import Footer from '@components/footer';
import SEO from "@components/seo"

const Layout = props => {
  return (
    <div className="layout__container">
      <Helmet>
        <style>{`body { background-color: ${props.bg}; }`}</style>
      </Helmet>
      <SEO {...props.seo} />
      {props.children}
      <div className="layout__footer mb-5">
        <Footer/>
      </div>
    </div>
  )
}

Layout.defaultProps = {
  bg: 'white'
}

Layout.propTypes = {
  seo: PropType.object.isRequired,
  bg: PropType.string,
  children: PropType.any.isRequired
}

export default Layout;
