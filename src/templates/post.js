import React from 'react';
import PropType from 'prop-types';
import ProgressiveImage from "react-progressive-graceful-image";
import * as timeago from 'timeago.js';
import AniLink from 'gatsby-plugin-transition-link/AniLink';
import Layout from '@components/layout';
import BlogControls from '@components/blog-controls';
import Markdown from '@components/markdown';

import { graphql } from 'gatsby'

const PostTemplate = ({ data, pageContext, location }) => {
  const post = data.mongodbKhaledmahercmsPosts;
  const seo = {
    title: post.title,
    description: post.content.substring(0, 200),
    image: post.hero.formats.medium.url
  }

  const isArabic = pageContext.isArabic;
  const textAlign = isArabic ? 'right' : 'left';
  const wordCount = post.content.split(" ").length;
  const heroThumbnailUrl = post.hero.formats.thumbnail.url;
  const heroUrl = process.env.NODE_ENV === 'production' ?
    post.hero.url :
    'https://www.designmantic.com/blog/wp-content/uploads/2016/07/social-media-cover-image-718x300.png'

  return (
    <Layout hideNavbar seo={seo}>
      <BlogControls pageContext={pageContext} location={location}/>
      <div className="mb-4 postTemplate__hero">
        <ProgressiveImage
          src={heroUrl}
          placeholder={heroThumbnailUrl}
        >
          {(src, loading) => <img style={{opacity: loading ? 0 : 1}} src={src} className="postTemplate__image"/> }
        </ProgressiveImage>
        <br/>
        <span className="font__body right float-right">
          {post.hero.caption}
        </span>
      </div>
      <div className="container font__message postTemplate__container">
        <div className="postTemplate__title d-flex flex-column mb-5" style={{textAlign}}>
          <h1 className="font__title--big mb-2">{post.title}</h1>
          <div>
            {timeago.format(post.createdAt)} &nbsp; &#8226; &nbsp;
            <span className="font__body font-white blogs__tag-item">{Math.round(wordCount / 200, 2) || 'less than a '} minutes read</span>
            {
              post.tags.map(tag => (
                <AniLink fade duration={0.2} className="mr-2 ml-2" key={tag} to={`/blog/tag/${tag.toLowerCase()}`}>
                  <span className="font__body font-white blogs__tag-item">{tag}</span>
                </AniLink>
              ))
            }
          </div>
        </div>
        <br/>

        <div dir={isArabic ? 'rtl' : 'ltr'} style={{textAlign}}>
          <Markdown body={post.content}/>
        </div>
        <br/>
      </div>
    </Layout>
  )
}

PostTemplate.propTypes = {
  data: PropType.any.isRequired,
  location: PropType.object.isRequired,
  pageContext: PropType.object.isRequired,
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
        caption
        formats {
          thumbnail {
            url
          }
          medium {
            url
          }
        }
      }
      tags
      content
      createdAt
      updatedAt
    }
  }
`
