import React from 'react';
import PropType from 'prop-types';
import ReactMarkdown from 'react-markdown';
import Layout from '@components/layout';

import { graphql } from 'gatsby'

const PostTemplate = ({ data }) => {
  const post = data.mongodbKhaledmahercmsPosts;
  const heroUrl = process.env.NODE_ENV === 'production' ?
    post.hero.url :
    'https://www.designmantic.com/blog/wp-content/uploads/2016/07/social-media-cover-image-718x300.png'

  return (
    <Layout>
      <div className="mb-4 postTemplate__hero">
        <img src={heroUrl} className="postTemplate__image"/>
      </div>
      <div className="container font__message postTemplate__container">
        <h1 className="font__title--big">{post.title}</h1>
        <br/>
        <ReactMarkdown source={post.content}/>
      </div>
    </Layout>
  )
}

PostTemplate.propTypes = {
  data: PropType.any.isRequired
}

export default PostTemplate

export const query = graphql`
  query Post($id: String!) {
    mongodbKhaledmahercmsPosts(
      id: {eq: $id}
    ) {
      id
      publish
      title
      hero {
        url
      }
      content
      createdAt
      updatedAt
    }
  }
`
