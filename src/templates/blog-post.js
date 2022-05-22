import React from 'react'
import { Link, graphql } from 'gatsby'
import get from 'lodash/get'

import Seo from '../components/seo'
import Layout from '../components/layout'
import Hero from '../components/hero'
import Tags from '../components/tags'
import * as styles from './blog-post.module.css'
import { navigate } from "gatsby"
import { isLoggedIn } from "../services/auth"
import Container from '../components/container'

const BlogPostTemplate = () => {
  const post = get(this.props, 'data.contentfulBlogPost')
  const previous = get(this.props, 'data.previous')
  const next = get(this.props, 'data.next')
  const navigation = get(this, "props.data.allContentfulNavigation.nodes");
  const socials = get(this, "props.data.allContentfulSocials.nodes");

  function checkLogin() {
    if (post?.protectPage && !isLoggedIn()) {
      navigate("/login")
      return null
    }
  }

  useEffect(() => {
    checkLogin()
  }, [])


  return (
    <Layout location={this.props.location} navigation={navigation} socials={socials} >
      <Seo
        title={post.title}
        description={post.description.childMarkdownRemark.excerpt}
        image={`http:${post.heroImage.resize.src}`}
      />
      <Hero
        image={post.heroImage?.gatsbyImageData}
        title={post.title}
        content={post.description?.childMarkdownRemark?.excerpt}
        rawDate={post.rawDate}
        endDate={post.endDate}
        timeToRead={post.body?.childMarkdownRemark?.timeToRead}
      />

      <div className="bg-white dark:bg-dark text-dark dark:text-light">
        <Container>
          <div className={styles.article}>
            <div
              dangerouslySetInnerHTML={{
                __html: post.content?.childMarkdownRemark?.html,
              }}
            />

            <Tags tags={post.tags} />
            {(previous || next) && (
              <nav>
                <ul className={styles.articleNavigation}>
                  {previous && (
                    <li>
                      <Link to={`/portfolio/${previous.slug}`} rel="prev">
                        ← {previous.title}
                      </Link>
                    </li>
                  )}
                  {next && (
                    <li>
                      <Link to={`/portfolio/${next.slug}`} rel="next">
                        {next.title} →
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            )}
          </div>
        </Container>
      </div>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $slug: String!
    $previousPostSlug: String
    $nextPostSlug: String
  ) {
    contentfulBlogPost(slug: { eq: $slug }) {
      slug
      protectPage
      title
      author {
        name
      }
      endDate(formatString: "MMMM YYYY")
      rawDate: endDate
      heroImage {
        gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED, width: 1280)
        resize(height: 630, width: 1200) {
          src
        }
      }
      content {
        childMarkdownRemark {
          html
          timeToRead
        }
      }
      tags
      description {
        childMarkdownRemark {
          excerpt
        }
      }
    }
    previous: contentfulBlogPost(slug: { eq: $previousPostSlug }) {
      slug
      title
    }
    next: contentfulBlogPost(slug: { eq: $nextPostSlug }) {
      slug
      title
    }
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
  }
`
