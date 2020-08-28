import React from 'react'
import PropType from 'prop-types';
import AniLink from 'gatsby-plugin-transition-link/AniLink';
import { graphql } from "gatsby"
import PostItem from '@components/post-item';
import Layout from '@components/layout';

const BlogPage = ({data}) => {
  return (
    <Layout bg="white" seo={{title: 'Khaled Maher | Blog', description: 'thoughts made for love', image: 'https://scontent.fcai20-1.fna.fbcdn.net/v/t1.0-9/103481744_1587539261396427_7896338582725589395_n.jpg'}}>
     <div className="container">
          <>
            <div className="blogs__header d-flex flex-column align-items-center text-centered">
              <AniLink fade duration={0.2} to={`/blog`} className="blob-click">
                <h1 className="font__title--big">My Thoughts</h1>
              </AniLink>
              <br/>
              <div className="blogs__tags mt-3 mb-3 d-flex flex-wrap justify-content-center">
                {data.allMongodbKhaledmahercmsTags.nodes.map(node => (
                  <AniLink fade duration={0.2} key={node.id} to={`/blog/tag/${node.name}`}>
                    <div className="blogs__tag-item mr-2 ml-2 mb-2"># {node.name}</div>
                  </AniLink>
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
