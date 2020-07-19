import React from 'react';
import ReactMarkdown from 'react-markdown';

import { graphql } from 'gatsby'

const PostTemplate = ({ data }) => {
  const post = data.mongodbKhaledmahercmsPosts;
  return (
    <>
      {console.log(post)}
      <h1>{post.title}</h1>
      <ReactMarkdown source={post.content}/>
    </>
      )
}

export default PostTemplate

export const query = graphql`
  query MongoDb($id: String!) {
    mongodbKhaledmahercmsPosts(id: {eq: $id}) {
      id
      publish
      title
      content
      createdAt
      updatedAt
    }
  }
`
