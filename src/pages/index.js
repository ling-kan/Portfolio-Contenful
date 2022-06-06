import React, { useEffect } from 'react'
import { graphql } from "gatsby";
import get from "lodash/get";
import Layout from "../components/layout";
import ArticlePreview from "../components/article-preview";
import HomeHero from "../components/home-hero";
import Header from '../components/header';
import Container from '../components/container';
import VerticalLoadMore from "../components/timeline/timeline-load-more";
import { motion } from "framer-motion";

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
      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.8 }}
      >
        <HomeHero
          animatedList={author?.animatedList}
          image={author?.heroImage?.gatsbyImageData}
          title={author?.title}
          name={author?.name}
          content={author?.shortBio?.shortBio}
          socials={socials}
        />
      </motion.div>
      <div id="work" className="pb-10 my-8">
        <Container className=" grid grid-cols-1 md:grid-cols-3 gap-4 md:grid-cols-1§e">
          <div className="col-span-1">
            <Header title="Work" span="recent" />
          </div>
          <div className="col-span-2">
            <ArticlePreview posts={posts} />
          </div>
        </Container >
      </div>

      <div id="about">
        <Container>
          <Header title="About" span="about me" />
          <VerticalLoadMore timeline={timeline} />
        </Container>
      </div>
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
