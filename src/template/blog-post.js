import React, { useEffect, useState } from 'react';
import { Link, graphql } from 'gatsby'
import get from 'lodash/get'
import Seo from '../components/seo'
import Layout from '../components/layout'
import BlogHeader from '../components/blog-header'
import * as styles from './blog-post.module.scss'
import { navigate } from "gatsby"
import { isLoggedIn } from "../services/auth"
import Container from '../components/container'
import Loader from '../components/loader'
// import TableOfContents from '../components/table-contents';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              tags={post.tags}
            />
            <div className="text-black relative">
              {/* <TableOfContents list={post.content?.childMarkdownRemark?.tableOfContents} /> */}
              <Container>
                <div className={styles.article}>
                  <h2 className={styles.articleTitle}>Summary</h2>
                  {post.summary && <div
                    dangerouslySetInnerHTML={{
                      __html: post.summary?.childMarkdownRemark?.html,
                    }}
                  />}

                  {post.role && post.endDate && <div className="grid grid-cols-2 gap-2">
                    <div>
                      <h2 className={styles.articleTitle}>Role</h2>
                      {post.role && <p>{post.role}</p>}
                    </div>
                    <div>
                      <h2 className={styles.articleTitle}>Duration</h2>
                      {post.endDate && <p>{post.startDate} - {post.endDate}</p>}
                    </div>
                  </div>
                  }

                  <div
                    dangerouslySetInnerHTML={{
                      __html: post.content?.childMarkdownRemark?.html,
                    }}
                  />

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
      startDate(formatString: "MMMM YYYY")
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
          tableOfContents(heading: "")
          timeToRead
        }
      }
      tags
      description {
        childMarkdownRemark {
          excerpt
        }
      }
      summary {
        childMarkdownRemark {
          html
        }
      }
      role
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
