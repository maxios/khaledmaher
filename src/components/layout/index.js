import React from 'react';
import PropType from 'prop-types';
import { Helmet } from 'react-helmet';
import NavBar from '@components/navbar';
import Footer from '@components/footer';
import SEO from "@components/seo"

const Layout = props => {
  return (
    <div className="layout__container">
      {!props.hideNavbar && <NavBar/> }
      <Helmet>
        <style>{`body { background-color: ${props.bg}; }`}</style>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
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
  bg: 'white',
  hideNavbar: false
}

Layout.propTypes = {
  seo: PropType.object.isRequired,
  bg: PropType.string,
  hideNavbar: PropType.bool,
  children: PropType.any.isRequired
}

export default Layout;
