import React from 'react'
import { graphql } from 'gatsby'
import get from 'lodash/get'
import Seo from '../components/seo'
import Layout from '../components/layout'
import BlogHeader from '../components/blog-header'
import ArticlePreview from '../components/article-preview'
import Container from '../components/container'

const BlogIndex = (props) => {
  const posts = get(props, "data.allContentfulBlogPost.nodes");
  const navigation = get(props, "data.allContentfulNavigation.nodes");
  const socials = get(props, "data.allContentfulSocials.nodes");

  return (
    <Layout location={props.location} navigation={navigation} socials={socials}>
      <Seo title="Portfolio" />
      <BlogHeader title="Portfolio" />
      <Container>
        <ArticlePreview posts={posts} />
      </Container>
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
        endDate(formatString: "MMMM YYYY")
        tags
        heroImage {
          gatsbyImageData(
            layout: FULL_WIDTH
            placeholder: BLURRED
          )
        }
        description {
          childMarkdownRemark {
            html
          }
        }
      }
    }
  }
`;
