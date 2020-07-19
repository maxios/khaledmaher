/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import Sidebar from '@organisms/sidebar';

import "./layout.css"
import SEO from "./seo.js"

const Layout = ({ children }) => {
  return (
    <>
      <SEO title="Khaled Maher | Software Engineer" />
      <Sidebar/>
      {children}
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
