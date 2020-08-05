import React from 'react'
import Link from 'gatsby-plugin-transition-link';
import Slugify from 'slugify';
import { StaticQuery, graphql } from "gatsby"
import PostItem from '@components/post-item';
import Layout from '@components/layout';

const BlogPage = () => {
  return (
    <Layout>
     <div className="container">
      <StaticQuery
        query={graphql`
        query MyQuery {
          allMongodbKhaledmahercmsPosts {
            nodes {
              id
              createdAt
              content
              publish
              hero {
                url
              }
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
      `}
        render={data => (
          <>
            <div className="blogs__header text-centered">
              <h1 className="font__title--big">My Thoughts</h1>
              <br/>
              <div className="blogs__tags d-flex justify-content-center">
                {data.allMongodbKhaledmahercmsTags.nodes.map(node => (
                  <Link key={node.id} to={`blog/tags/${node.name}`}>
                    <div className="blogs__tag-item">{node.name}</div>
                  </Link>
                ))}
              </div>
            </div>
            <section className="articles">
              {data.allMongodbKhaledmahercmsPosts.nodes.map(node => (
                <Link key={node.id} to={`/blog/${Slugify(node.title)}`}>
                  <PostItem data={node}/>
                </Link>
              ))}
            </section>
          </>
        )}
      />
     </div>
    </Layout>
  );
}

export default BlogPage;
