// import React from 'react'
// import ReactMarkdown from 'react-markdown';
// import { StaticQuery, graphql } from "gatsby"
// import Layout from '../components/layout.js';
// import { Link } from 'gatsby';
// import Post from '@molecules/post';
//
// const BlogPage = () => {
//   return (
//     <StaticQuery
//       query={graphql`
//         query MyQuery {
//           allMongodbKhaledmahercmsPosts {
//             nodes {
//               id
//               createdAt
//               content
//               publish
//               title
//               updatedAt
//             }
//           }
//         }
//       `}
//       render={data => (
//         <div className="container">
//           <section className="articles">
//             {data.allMongodbKhaledmahercmsPosts.nodes.map(node => (
//               <Post key={node.id} data={node}/>
//             ))}
//           </section>
//         </div>
//       )}
//     />
//   );
// }
//
// export default BlogPage;
