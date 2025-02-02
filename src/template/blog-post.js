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
import LazyLoad from 'react-lazyload'
// import TableOfContents from '../components/table-contents';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import ErrorBoundary from '../components/error-boundary';

const BlogPostTemplate = (props) => {
  const post = get(props, 'data.contentfulBlogPost')
  const previous = get(props, 'data.previous')
  const next = get(props, 'data.next')
  const navigation = get(props, "data.allContentfulNavigation.nodes");
  const socials = get(props, "data.allContentfulSocials.nodes");
  const images = get(props, 'data.allFile.nodes');
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
  const renderContentWithZoom = (html) => {
    const div = document && document?.createElement('div');
    div.innerHTML = html;
    const elements = Array.from(div.childNodes);
    const content = elements.map((node, index) => {
      if (node.tagName === 'IMG') {
        const image = images.find(img => node.src.includes(img.relativePath));
        if (image) {
          const gatsbyImage = getImage(image.childImageSharp.gatsbyImageData);
          return (
            <Zoom key={index}>
              <GatsbyImage image={gatsbyImage} alt={node.alt} title={node.title} className={styles.thumbnailImage} />
            </Zoom>
          );
        } else {
          return (
            <Zoom key={index}>
              <img src={node.src} alt={node.alt} title={node.title} className={styles.thumbnailImage} />
            </Zoom>
          );
        }
      } else {
        return <div key={index} dangerouslySetInnerHTML={{ __html: node.outerHTML }} />;
      }
    });
    return content;
  };
  const contentWithZoom = renderContentWithZoom(post.content?.childMarkdownRemark?.html || '');


  return (
    <>
      {
        loader ?
          <Loader />
          :
          <ErrorBoundary>
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

                    <LazyLoad height={200} offset={100} once>
                      <div>{contentWithZoom}</div>
                    </LazyLoad>


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
          </ErrorBoundary>
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
    allFile(filter: { extension: { regex: "/(jpg|jpeg|png)/" } }) {
      nodes {
        relativePath
        childImageSharp {
          gatsbyImageData(layout: CONSTRAINED, width: 300)
        }
      }
    }
  }
`
