import React from 'react';
import PropType from 'prop-types';
import ReactMarkdown from 'react-markdown';
import Layout from '@components/layout';

import { graphql } from 'gatsby'

const PostTemplate = ({ data }) => {
  const post = data.mongodbKhaledmahercmsPosts;
  return (
    <Layout>
      <div className="mb-4 postTemplate__hero">
        <img src={post.hero.url} className="postTemplate__image"/>
      </div>
      <div className="container font__message postTemplate__container">
        <h1 className="font__title--big">{post.title}</h1>
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
  query MongoDb($id: String!) {
    mongodbKhaledmahercmsPosts(id: {eq: $id}) {
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
