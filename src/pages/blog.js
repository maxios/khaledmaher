import React from 'react'
import PropType from 'prop-types';
import Link from 'gatsby-plugin-transition-link';
import { graphql } from "gatsby"
import PostItem from '@components/post-item';
import Layout from '@components/layout';

const BlogPage = ({data}) => {
  return (
    <Layout>
     <div className="container">
          <>
            <div className="blogs__header d-flex flex-column align-items-center text-centered">
              <Link to={`/blog`}>
                <h1 className="font__title--big">My Thoughts</h1>
              </Link>
              <br/>
              <div className="blogs__tags mt-3 mb-3 d-flex flex-wrap justify-content-center">
                {data.allMongodbKhaledmahercmsTags.nodes.map(node => (
                  <Link key={node.id} to={`/blog/tag/${node.name}`}>
                    <div className="blogs__tag-item mr-2 ml-2 mb-2"># {node.name}</div>
                  </Link>
                ))}
              </div>
            </div>
            <section className="articles">
              {data.allMongodbKhaledmahercmsPosts.nodes.map(node => (
                <PostItem key={node.id} data={node}/>
              ))}
            </section>
          </>
     </div>
    </Layout>
  );
}

BlogPage.propTypes = {
  data: PropType.object.isRequired
}

export const query = graphql`
  query Blog($tag: [String]) {
    allMongodbKhaledmahercmsPosts(filter: {tags: {in: $tag}}) {
      nodes {
        id
        createdAt
        content
        publish
        hero {
          url
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
        title
        updatedAt
      }
    }
    allMongodbKhaledmahercmsTags {
      nodes {
        id
        name
      }
    }
  }
`

export default BlogPage;
