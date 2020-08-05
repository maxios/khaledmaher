require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: `Khaled Maher | Software Engineer`,
    description: `The Realm you want to know more about...`,
    author: `@maxios`,
    // Used for resolving images in social cards
    siteUrl: `https://example.com`,
    // Used for social links in the root footer
    social: [
      {
        name: `Twitter`,
        url: `https://twitter.com/gatsbyjs`,
      },
      {
        name: `GitHub`,
        url: `https://github.com/gatsbyjs`,
      },
    ],
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    "gatsby-plugin-manifest",
    "gatsby-plugin-offline",
    "gatsby-plugin-svg-sprite",
    "gatsby-plugin-transition-link",
    "gatsby-plugin-sass",
    {
      resolve: `gatsby-source-mongodb`,
      options: {
        connectionString: process.env.GATSBY_DATABASE_URI,
        dbName: `khaledmaher-cms`,
        collection: ['posts', 'upload_file', 'taggings'],
        extraParams: {
          preserveObjectIds: true,
        },
        preserveObjectIds: true
      }
    },
    {
      resolve: `gatsby-plugin-s3`,
      options: {
        bucketName: 'khaledmaher.com'
      },
    },
    {
      resolve: `gatsby-plugin-alias-imports`,
      options: {
        alias: {
          "@src": "src",
          "@components": "src/components",
          "@templates": "src/templates",
          "@constants": "src/constants",
          "@layouts": "src/layouts",
          "@pages": "src/pages",
          "@images": "src/images",
          "@styles": "src/styles"
        },
        extensions: [
          "js",
        ],
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
  mapping: {
    "mongodbKhaledmahercmsPosts.hero": "mongodbKhaledmahercmsUpload_file.mongodb_id"
  },
}
