import React from 'react';
import PropType from 'prop-types';
import ProgressiveImage from "react-progressive-image-loading";
import * as timeago from 'timeago.js';
import Link from 'gatsby-plugin-transition-link';
import Slugify from 'slugify';
import ReactMarkdown from 'react-markdown';
import Layout from '@components/layout';
import ArrowIcon from '@images/icons/arrow.svg';
import ShareIcon from '@images/icons/share.svg';
import ListIcon from '@images/icons/list.svg';
import SVG from '@components/svg';

import { graphql } from 'gatsby'

const PostTemplate = ({ data, pageContext }) => {
  const post = data.mongodbKhaledmahercmsPosts;
  const next = pageContext.next;
  const prev = pageContext.prev;
  const wordCount = post.content.split(" ").length;
  const heroThumbnailUrl = post.hero.formats.thumbnail.url;
  const heroUrl = process.env.NODE_ENV === 'production' ?
    post.hero.url :
    'https://www.designmantic.com/blog/wp-content/uploads/2016/07/social-media-cover-image-718x300.png'

  return (
    <Layout seo={{title: post.title, description: post.content.substring(0, 200)}}>
      <div className="postTemplate__controls-container d-flex align-items-end align-items-md-center z-index-5 ">
        <div className="d-flex flex-row flex-md-column absolute left col-12 p-0">
          <Link className="postTemplate__controls-button order-2 order-md-1" to={`/blog`}>
            <SVG id={ListIcon.id} size={50} color="white"/>
          </Link>
          {
            prev && (
              <Link className="postTemplate__controls-button order-1 order-md-2" to={`/blog/${Slugify(prev)}`}>
                <SVG id={ArrowIcon.id} size={50} color="white" inverse/>
              </Link>
            )
          }
          <Link className="postTemplate__controls-button order-3" to={`/blog`}>
            <SVG id={ShareIcon.id} size={30} color="white"/>
          </Link>

          {
            next && (
              <Link className="postTemplate__controls-button absolute-tablet right order-4" to={`/blog/${Slugify(next)}`}>
                <SVG id={ArrowIcon.id} size={50} color="white"/>
              </Link>
            )
          }

        </div>

      </div>
      <div className="mb-4 postTemplate__hero">
        <ProgressiveImage
          preview={heroThumbnailUrl}
          src={heroUrl}
          transitionTime={500}
          transitionFunction="ease"
          render={(src, style) => <img src={src} style={style} className="postTemplate__image"/> }
        />
        <br/>
        <span style={{float: 'right', right: 0}} className="font__body">{post.hero.caption}</span>
      </div>
      <div className="container font__message postTemplate__container">
        <div className="postTemplate__title d-flex flex-column mb-5">
          <h1 className="font__title--big mb-2">{post.title}</h1>
          <div>
            {timeago.format(post.createdAt)} &nbsp; &#8226; &nbsp;
            <span className="font__body font-white blogs__tag-item">{Math.round(wordCount / 200, 2) || 'less than a '} minutes read</span>&nbsp; &#8226; &nbsp;
            {
              post.tags.map(tag => (
                <Link className="mr-2 ml-2" key={tag} to={`/blog/tag/${tag}`}>
                  <span className="font__body font-white blogs__tag-item">{tag}</span>
                </Link>
              ))
            }
          </div>
        </div>
        <br/>
        <ReactMarkdown source={post.content}/>
      </div>
    </Layout>
  )
}

PostTemplate.propTypes = {
  data: PropType.any.isRequired,
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
        }
      }
      tags
      content
      createdAt
      updatedAt
    }
  }
`
