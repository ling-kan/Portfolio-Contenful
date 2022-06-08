import React, { useEffect } from 'react'
import { graphql } from "gatsby";
import get from "lodash/get";
import Layout from "../components/layout";
import ArticlePreview from "../components/article-preview";
import HomeHero from "../components/home-hero";
import VerticalLoadMore from "../components/timeline/timeline-load-more";
import TitleContainer from '../components/title-container';

const RootIndex = (props) => {
  const posts = get(props, "data.allContentfulBlogPost.nodes");
  const [author] = get(props, "data.allContentfulLanding.nodes");
  const timeline = get(props, "data.allContentfulTimeline.nodes");
  const navigation = get(props, "data.allContentfulNavigation.nodes");
  const socials = get(props, "data.allContentfulSocials.nodes");
  useEffect(() => {
    setTimeout(scroll(), 1000);
  });

  function scroll() {
    if (props.location.hash) {
      const element = document.querySelector(props.location.hash).offsetTop - 75;
      element && window.scrollTo({ top: element, behavior: "smooth" });
    }
  }
  return (
    <Layout location={props.location} navigation={navigation} socials={socials} fullHeaderHeight={true}>
      <HomeHero
        animatedList={author?.animatedList}
        image={author?.heroImage?.gatsbyImageData}
        title={author?.title}
        name={author?.name}
        socials={socials}
      />
      <TitleContainer title="Bio" subtitle="recent" id="bio">
        <p>{author?.shortBio?.shortBio}</p>
      </TitleContainer>

      <TitleContainer title="career" subtitle="work" id="work">
        <ArticlePreview posts={posts} />
      </TitleContainer>

      <TitleContainer title="About" subtitle="timelinw" id="about">
        <VerticalLoadMore timeline={timeline} />
      </TitleContainer>
    </Layout >
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
