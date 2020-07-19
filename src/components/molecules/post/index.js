import React from 'react'
import PropType from 'prop-types';
import { Link } from 'gatsby';
import ReactMarkdown from 'react-markdown';

const Post = ({ data }) => {
  return (
    <section className="hero">
      <div className="hero-body">
        <div className="container">
          <div className="columns">
            <div className="column is-8 is-offset-2">
              <figure className="image is-16by9">
                <img src="https://s3.eu-west-1.amazonaws.com/khaledmaher.com-assets/xwey6ppzqu4mnfg0e1ae_65adcd1e95.jpeg" alt=""/>
              </figure>
            </div>
          </div>

          <section className="section">
            <div className="columns">
              <div className="column is-8 is-offset-2">
                <div className="content is-medium">
                  <h2 className="subtitle is-4">{data.createdAt}</h2>
                  <Link to={`/${data.id}`}>
                    <h1 className="title">{data.title}</h1>
                  </Link>
                  <ReactMarkdown source={data.content}/>
                </div>
              </div>
            </div>
          </section>

          <div className="is-divider"></div>
        </div>
      </div>
    </section>
  )
}

Post.propTypes = {
  data: PropType.object.isRequired
}

export default Post
