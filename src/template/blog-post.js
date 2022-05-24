import React, { useEffect, useState } from 'react';
import { Link, graphql } from 'gatsby'
import get from 'lodash/get'

import Seo from '../components/seo'
import Layout from '../components/layout'
import BlogHeader from '../components/blog-header'
import Tags from '../components/tags'
import * as styles from './blog-post.module.scss'
import { navigate } from "gatsby"
import { isLoggedIn } from "../services/auth"
import Container from '../components/container'
import Loader from '../components/loader'

const BlogPostTemplate = (props) => {
  const post = get(props, 'data.contentfulBlogPost')
  const previous = get(props, 'data.previous')
  const next = get(props, 'data.next')
  const navigation = get(props, "data.allContentfulNavigation.nodes");
  const socials = get(props, "data.allContentfulSocials.nodes");
  const [loader, setLoader] = useState(true);

  function checkLogin() {
    if (post?.protectPage && !isLoggedIn()) {
      navigate("/login")
      return null
    } else {
      setLoader(false)
    }
  }

  useEffect(() => {
    checkLogin()
  }, [])


  return (
    <>
      {
        loader ?
          <Loader />
          :
          <Layout location={props.location} navigation={navigation} socials={socials} >
            <Seo
              title={post.title}
              description={post.description.childMarkdownRemark.excerpt}
              image={`http:${post.heroImage.resize.src}`}
            />
            <BlogHeader
              image={post.heroImage?.gatsbyImageData}
              title={post.title}
              content={post.description?.childMarkdownRemark?.excerpt}
              rawDate={post.rawDate}
              endDate={post.endDate}
              timeToRead={post.body?.childMarkdownRemark?.timeToRead}
            />

            <div className="bg-white dark:bg-secondary text-secondary dark:text-primary">
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
      }
    </>
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
