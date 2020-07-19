/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const path = require(`path`);

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

  const getBlogs = makeRequest(graphql, `
    {
      allMongodbKhaledmahercmsPosts {
        nodes {
          id
        }
      }
    }
    `).then(result => {
    // Create pages for each blog.
    result.data.allMongodbKhaledmahercmsPosts.nodes.forEach(node => {
      createPage({
        path: `/${node.id}`,
        component: path.resolve(`src/templates/blog.js`),
        context: {
          id: node.id,
        },
      })
    })
  });

  // Query for blogs nodes to use in creating pages.
  return getBlogs;
};
