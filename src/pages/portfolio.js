import React from 'react'
import { graphql } from 'gatsby'
import get from 'lodash/get'
import Seo from '../components/seo'
import Layout from '../components/layout'
import BlogHeader from '../components/blog-header'
import ArticlePreview from '../components/article-preview'

const BlogIndex = (props) => {
  const posts = get(this, 'props.data.allContentfulBlogPost.nodes')
  return (
    <Layout location={props.location}>
      <Seo title="Blog" />
      <BlogHeader title="Blog" />
      <ArticlePreview posts={posts} />
    </Layout>
  )
}
export default BlogIndex

export const pageQuery = graphql`
  query BlogIndexQuery {
    allContentfulSocials {
      nodes {
        url
        type
      }
    }
    allContentfulNavigation(sort: { fields: [order], order: ASC }) {
      nodes {
        title
        url
        order
      }
    }
    allContentfulBlogPost(sort: { fields: [endDate], order: DESC }) {
      nodes {
        title
        slug
        startDate(formatString: "MMMM YYYY")
        endDate(formatString: "MMMM YYYY")
        role
        summary {
          childMarkdownRemark {
            html
          }
        }
        content {
          childMarkdownRemark {
            html
          }
        }
        heroImage {
          gatsbyImageData(
            layout: FULL_WIDTH
            placeholder: BLURRED
            width: 424
            height: 212
          )
        }
      }
    }
  }
`;
