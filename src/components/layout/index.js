import React from 'react';
import PropType from 'prop-types';
import Footer from '@components/footer';
import SEO from "@components/seo"

const Layout = props => {
  return (
    <div className="layout__container">
      <SEO {...props.seo} />
      {props.children}
      <Footer/>
    </div>
  )
}

Layout.propTypes = {
  seo: PropType.object.isRequired,
  children: PropType.any.isRequired
}

export default Layout;
