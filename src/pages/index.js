import React, { useEffect } from 'react'
import { graphql } from "gatsby";
import get from "lodash/get";
import Layout from "../components/layout";
import ArticlePreview from "../components/article-preview";
import HomeHero from "../components/home-hero";
import TitleContainer from '../components/title-container';
import Resume from '../components/resume';

const RootIndex = (props) => {
  const posts = get(props, "data.allContentfulBlogPost.nodes");
  const [author] = get(props, "data.allContentfulLanding.nodes");
  const timeline = get(props, "data.allContentfulTimeline.nodes");
  const education = get(props, "data.allContentfulEducation.nodes");
  const socials = get(props, "data.allContentfulSocials.nodes");

  useEffect(() => {
    setTimeout(scroll(), 1000);
  });
  function scroll() {
    if (props.location.hash) {
      const element = document?.querySelector(props.location.hash)?.offsetTop - 75;
      element && window.scrollTo({ top: element, behavior: "smooth" });
    }
  }
  return (
    <Layout location={props.location} fullHeaderHeight={true}>
      <HomeHero
        animatedList={author?.animatedList}
        image={author?.heroImage?.gatsbyImageData}
        title={author?.title}
        name={author?.name}
        socials={socials}
      />
      {author?.bio?.childMarkdownRemark.html && <TitleContainer title="About me" id="about">
        <div
          dangerouslySetInnerHTML={{
            __html: author?.bio?.childMarkdownRemark.html,
          }}
        />
      </TitleContainer>}
      <div id="resume" />
      <TitleContainer title="Experience" id="experience">
        <Resume timeline={timeline} />
      </TitleContainer>
      <TitleContainer title="Education" id="education">
        <Resume timeline={education} />
      </TitleContainer>
      <TitleContainer title="Portfolio" id="portfolio">
        <ArticlePreview posts={posts} />
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
      allContentfulEducation(sort: { fields: [endDate], order: DESC }) {
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
        bio {
        childMarkdownRemark {
          html
        }
      }
      }
    }
  }
`;
