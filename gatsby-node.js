/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require(`path`);
require('./src/utils/slugify.js');

const makeRequest = (graphql, request) => new Promise((resolve, reject) => {
  // Query for nodes to use in creating pages.
  resolve(
    graphql(request).then(result => {
      if (result.errors) {
        reject(result.errors)
      }

      return result;
    })
  )
});

// Implement the Gatsby API “createPages”. This is called once the
// data layer is bootstrapped to let plugins create pages from data.
exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;

  const getPosts = makeRequest(graphql, `
     {
       allMongodbKhaledmahercmsPosts(filter: {publish: {eq: true}}) {
         nodes {
           id
           title
           tags
         }
       }
       allMongodbKhaledmahercmsTags {
        nodes {
          id,
          name
        }
       }
     }
     `).then(result => {
       // Create pages for each blog.
       result.data.allMongodbKhaledmahercmsPosts.nodes.forEach((post, index, array) => {
         createPage({
           path: `/blog/${post.title.slugify('-')}`,
           component: path.resolve(`src/templates/post.js`),
           context: {
             id: post.id,
             next: (array[index+1] || {}).title,
             prev: (array[index-1] || {}).title,
             isArabic: post.tags.includes('عربي')
           },
         })
       })

       result.data.allMongodbKhaledmahercmsTags.nodes.forEach(node => {
         createPage({
           path: `/blog/tag/${node.name.slugify('-')}`,
           component: path.resolve(`src/pages/blog.js`),
           context: {
             id: node.id,
             tag: [node.name]
           },
         })
       })
     });

  return getPosts;
};
