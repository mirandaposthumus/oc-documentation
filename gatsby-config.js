/* eslint-disable @typescript-eslint/camelcase */
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})
const docsQuery = `{
  docs: allMdx(filter: {fileAbsolutePath: {glob: "**/content/docs/**/*.mdx"}}) {
    edges {
      node {
        objectID: id
        fileAbsolutePath
        frontmatter {
          section
          title
          summary
          authors
        }
        excerpt(pruneLength:5000)
      }
    }
  }
}
`
const blogQuery = `{
  blogs: allMdx(filter: {fileAbsolutePath: {glob: "**/content/blog/*.mdx"}}) {
    edges {
      node {
        objectID: id
        fileAbsolutePath
        timeToRead
        frontmatter {
          title
          authors
          date
          tags
        }
        excerpt(pruneLength:5000)
      }
    }
  }
}`

const apiRefQuery = `{
  allSitePage(filter: {path: {glob: "/api-reference/*/*/*"}, context: {}}) {
    nodes {
      path
      context {
        operation {
          operationId
          summary
          description
          verb
          path
          security {
            OAuth2
          }
          section {
            name
          }
          resource {
            name
          }
        }
      }
    }
  }
}`

const flatten = arr => {
  return arr.map(({ node: { frontmatter, ...rest } }) => ({
    ...frontmatter,
    ...rest,
  }))
}

const settings = {
  attributesToSnippet: [`excerpt:20`, `summary:20`],
}

const queries = [
  {
    query: docsQuery,
    transformer: ({ data }) => flatten(data.docs.edges),
    indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME,
    settings,
  },
  {
    query: blogQuery,
    transformer: ({ data }) => flatten(data.blogs.edges),
    indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME,
    settings,
  },
  {
    query: apiRefQuery,
    transformer: ({ data }) =>
      data.allSitePage.nodes.map(result => {
        const {
          section,
          resource,
          path,
          operationId,
          summary,
          verb,
          security,
        } = result.context.operation
        return {
          objectID: operationId,
          link: result.path,
          path,
          summary,
          verb,
          roles: security[0].OAuth2
            ? security[0].OAuth2.filter(r => r !== 'FullAccess')
            : [],
          section: `API Reference / ${section.name} / ${resource.name}`,
        }
      }),
    indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME,
  },
]

const toExport = {
  siteMetadata: {
    siteUrl: 'https://ordercloud.io',
    title: `OrderCloud Documentation`,
    description: `Documentation for OrderCloud's B2B eCommerce API`,
    author: `OrderCloud`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        // The property ID; the tracking code won't be generated without it
        trackingId: 'UA-82258138-1',
        // Defines where to place the tracking script - `true` in the head and `false` in the body
        head: true,
        cookieDomain: 'ordercloud.io',
      },
    },
    `gatsby-ordercloud-version`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-catch-links`,
    `gatsby-transformer-json`,
    `gatsby-plugin-material-ui`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-typescript-checker`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/assets/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/content`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `ordercloud documenation`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/assets/images/four51-badge--orange.svg`,
      },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        extensions: ['.mdx', '.md'],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              className: 'anchor',
            },
          },
          `gatsby-remark-prismjs`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590, // must be set
            },
          },
        ],
      },
    },
  ],
}

module.exports = toExport
if (process.env.GATSBY_ALGOLIA_ADMIN_API_KEY) {
  // for local development, don't store GATSBY_ALGOLIA_ADMIN_API_KEY
  // because it will rebuild the algolia index
  toExport.plugins.push({
    resolve: `gatsby-plugin-algolia`,
    options: {
      appId: process.env.GATSBY_ALGOLIA_APP_ID,
      apiKey: process.env.GATSBY_ALGOLIA_ADMIN_API_KEY,
      indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME, // for all queries
      queries,
      chunkSize: 10000, // default: 1000
    },
  })
}
