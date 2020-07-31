import React from 'react';
import PropType from 'prop-types';
import Footer from '@components/footer';
import SEO from "@components/seo"

const Layout = props => (
  <div className="layout__container">
    <SEO title="Khaled Maher | Software Engineer" />
    {props.children}
    <Footer/>
  </div>
)

Layout.propTypes = {
  children: PropType.any.isRequired
}

export default Layout;
