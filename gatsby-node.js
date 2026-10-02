const path = require('path')
const fs = require('fs')
// filepath: /Users/ling/Documents/BACKUP 2/Portfolio-Contenful/gatsby-node.js

// Expose which artwork files exist in static/images so <ImageSlot> can show them,
// or fall back gracefully, without any manual flag. Re-run `npm run dev` after adding files.
exports.onCreateWebpackConfig = ({ actions, plugins }) => {
  const dir = path.resolve('static/images')
  const files = fs.existsSync(dir) ? fs.readdirSync(dir) : []
  actions.setWebpackConfig({
    plugins: [plugins.define({ __IMAGERY_FILES__: JSON.stringify(files) })],
  })
}

// Declare the content model from scripts/contentful-model.js so queries keep working before those
// content types exist in Contentful (they just return empty and components fall back to defaults).
exports.createSchemaCustomization = ({ actions }) => {
  const asset = (field) => `ContentfulAsset @link(by: "id", from: "${field}___NODE")`
  actions.createTypes(`
    type ContentfulSectionHeader implements ContentfulReference & ContentfulEntry & Node {
      contentful_id: String!
      node_locale: String!
      key: String
      eyebrow: String
      title: String
      highlightWords: [String]
      intro: String
      buttonLabel: String
    }
    type ContentfulValuePillar implements ContentfulReference & ContentfulEntry & Node {
      contentful_id: String!
      node_locale: String!
      title: String
      description: String
      order: Int
    }
    type ContentfulTestimonial implements ContentfulReference & ContentfulEntry & Node {
      contentful_id: String!
      node_locale: String!
      quote: String
      name: String
      role: String
      company: String
      photo: ${asset('photo')}
      order: Int
    }
    type ContentfulPageHeader implements ContentfulReference & ContentfulEntry & Node {
      contentful_id: String!
      node_locale: String!
      slug: String
      eyebrow: String
      title: String
      intro: String
      headerImage: ${asset('headerImage')}
      seoTitle: String
      seoDescription: String
    }
    type ContentfulSiteSettings implements ContentfulReference & ContentfulEntry & Node {
      contentful_id: String!
      node_locale: String!
      siteTitle: String
      siteDescription: String
      socialShareImage: ${asset('socialShareImage')}
      introLabel: String
      heroPrimaryCtaLabel: String
      heroSecondaryCtaLabel: String
      availability: String
      cvFile: ${asset('cvFile')}
      valuePillarsLabel: String
      achievementsLabel: String
      logoStripLabel: String
      featuredProjectCount: Int
      aboutImage: ${asset('aboutImage')}
      aboutImageCaption: String
      expertiseImage: ${asset('expertiseImage')}
      contactImage: ${asset('contactImage')}
      footerCopyright: String
      notFoundTitle: String
      notFoundButtonLabel: String
    }
    type ContentfulBlogPost implements ContentfulReference & ContentfulEntry & Node {
      headlineResult: String
    }
  `)
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Define a template for blog post
  const blogPost = path.resolve('./src/template/blog-post.js')

  const result = await graphql(
    `
      {
        allContentfulBlogPost {
          nodes {
            title
            slug
            protectPage
          }
        }
      }
    `
  )

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your Contentful posts`,
      result.errors
    )
    return
  }

  const posts = result.data.allContentfulBlogPost.nodes

  // Create blog posts pages
  // But only if there's at least one blog post found in Contentful
  // `context` is available in the template as a prop and as a variable in GraphQL
  if (posts.length > 0) {
    posts.forEach((post, index) => {
      const previousPostSlug = index === 0 ? null : posts[index - 1].slug
      const nextPostSlug =
        index === posts.length - 1 ? null : posts[index + 1].slug

      createPage({
        path: `/portfolio/${post.slug}/`,
        component: blogPost,
        context: {
          slug: post.slug,
          previousPostSlug,
          nextPostSlug,
        },
      })
    })
  }
}

