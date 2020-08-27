import React from 'react';
import PropType from 'prop-types';
import { Helmet } from 'react-helmet';
import NavBar from '@components/navbar';
import Footer from '@components/footer';
import SEO from "@components/seo"
import Div100vh from 'react-div-100vh'

const Layout = props => {
  return (
    <Div100vh>
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
    </Div100vh>
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
