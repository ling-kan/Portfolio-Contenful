import React, { useEffect, useState } from 'react'
import { graphql } from "gatsby";
import get from "lodash/get";
import Layout from "../components/layout";
import ArticlePreview from "../components/article-preview";
import HomeHero from "../components/home-hero";
import Timeline from "../components/timeline";
import Header from '../components/header';
import Container from '../components/container';
import VerticalLoadMore from "../components/vertical-load-more";

const RootIndex = (props) => {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const systemDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode({ darkMode: systemDarkMode });
  }, []);
  const posts = get(props, "data.allContentfulBlogPost.nodes");
  const [author] = get(props, "data.allContentfulLanding.nodes");
  const timeline = get(props, "data.allContentfulTimeline.nodes");
  const navigation = get(props, "data.allContentfulNavigation.nodes");
  const socials = get(props, "data.allContentfulSocials.nodes");
  console.log(process.env.CONTENTFUL_SPACE_ID, process.env.NODE_ENV)
  return (
    <Layout location={props.location} navigation={navigation} socials={socials} >
      <HomeHero
        animatedList={author?.animatedList}
        image={author?.heroImage?.gatsbyImageData}
        title={author?.title}
        name={author?.name}
        content={author?.shortBio?.shortBio}
      />
      <div className="bg-dark" id="about">
        <Container>
          <Header title="Timeline" dark={true} />
          <VerticalLoadMore timeline={timeline} />
        </Container>
      </div>

      <div id="portfolio">
        <Container >
          <Header title="Portfolio" />
          <ArticlePreview posts={posts} />
        </Container >
      </div>
    </Layout>
  );
}

export default RootIndex;

export const pageQuery = graphql`
  query HomeQuery {
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
            width: 424
            height: 212
          )
        }
        description {
          childMarkdownRemark {
            html
          }
        }
      }
    }
    allContentfulTimeline(sort: { fields: [endDate], order: DESC }) {
      nodes {
        jobTitle
        startDate(formatString: "MMMM YYYY")
        endDate(formatString: "MMMM YYYY")
        company
        bio {
        childMarkdownRemark {
          html
        }
        }
        icon {
          gatsbyImageData(
            layout: FULL_WIDTH
            placeholder: BLURRED
            width: 40
            height: 20
          )
        }
      }
    }
    allContentfulLanding(
      filter: { contentful_id: { eq: "5gcA2XyhjtzTDF0oz2Mz2" } }
    ) {
      nodes {
        name
        animatedList
      }
    }
  }
`;
