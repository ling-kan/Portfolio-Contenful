import React, { useEffect } from 'react'
import { graphql } from "gatsby";
import get from "lodash/get";
import Layout from "../components/layout";
import ArticlePreview from "../components/article-preview";
import HomeHero from "../components/home-hero";
import TitleContainer from '../components/title-container';
import Resume from '../components/resume';
import Socials from '../components/socials';
import KeyMetrics from '../components/key-metrics';

const RootIndex = (props) => {
  const posts = get(props, "data.allContentfulBlogPost.nodes");
  const [author] = get(props, "data.allContentfulLanding.nodes");
  const timeline = get(props, "data.allContentfulTimeline.nodes");
  const education = get(props, "data.allContentfulEducation.nodes");

  useEffect(() => {
    const scroll = () => {
      if (props.location.hash) {
        const element = document.querySelector(props.location.hash);
        if (element) {
          const offset = element.offsetTop - 75;
          window.scrollTo({ top: offset, behavior: "smooth" });
        }
      }
    };

    setTimeout(scroll, 500);
  }, [props.location.hash]);


  return (
    <Layout location={props.location} fullHeaderHeight={true}>
      <div id="bio" />
      <HomeHero
        animatedList={author?.animatedList}
        image={author?.image}
        title={author?.title}
        name={author?.name}
        tagline={author?.tagline}
      />

      {author?.bio?.childMarkdownRemark.html && <TitleContainer title="About me" id="about" subtitle="Summary">
        <div
          className='mt-0 md:mt-6'
          dangerouslySetInnerHTML={{
            __html: author?.bio?.childMarkdownRemark.html,
          }}
        />
      </TitleContainer>
      }

      {author?.keyMetrics && <TitleContainer title="" id="" subtitle="Key Metrics">
        <KeyMetrics list={author?.keyMetrics} />
      </TitleContainer>}

      {author?.keyAchievements?.childMarkdownRemark.html && <TitleContainer subtitle="Key Achievements" id="key-achievements" >
        <div
          dangerouslySetInnerHTML={{
            __html: author?.keyAchievements.childMarkdownRemark.html,
          }}
        />
      </TitleContainer>}

      <div id="resume" />
      <TitleContainer title="Resume" subtitle="Work Experience" id="experience">
        <Resume timeline={timeline} />
      </TitleContainer>
      <TitleContainer subtitle="Education" id="education">
        <Resume timeline={education} />
      </TitleContainer>
      <TitleContainer title="Portfolio" id="portfolio">
        <ArticlePreview posts={posts} />
      </TitleContainer>
      <TitleContainer title="Let's Talk" id="contact">
        <p className="text-2xl mb-8">Want to work together? <br /> Let's connect!</p>
        <Socials width="w-10" className="justify-start" />
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
        hiddenPage
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
        currentRole
        company
        description {
        childMarkdownRemark {
          html
        }
        }
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
        keyMetrics {
  label
  value
}
        tagline {
        childMarkdownRemark {
          html
        } 
        }
        bio {
        childMarkdownRemark {
          html
        } 
        }
        keyAchievements {
          childMarkdownRemark {
            html
          }
        }
        

        image{ 
          gatsbyImageData(
            layout: FULL_WIDTH
            placeholder: BLURRED
          )
        }
      }
    }
  }
`;
