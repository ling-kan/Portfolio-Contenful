import React from 'react'
import { graphql } from "gatsby";
import HomeStory from '../components/home-story';

const RootIndex = (props) => <HomeStory {...props} />

export default RootIndex;

export const pageQuery = graphql`
  query HomeQuery {
    allContentfulSocials {
      nodes {
        url
        type
      }
    }
    allContentfulNavigation(sort: { order: ASC }) {
      nodes {
        title
        url
        order
      }
    }
    allContentfulBlogPost(sort: { endDate: DESC }) {
      nodes {
        title
        slug
        endDate
        tags
        hiddenPage
        protectPage
        headlineResult
        heroImage {
          gatsbyImageData(
            layout: FULL_WIDTH
            placeholder: BLURRED
          )
        }
      }
    }
    allContentfulSectionHeader {
      nodes { key eyebrow title highlightWords intro buttonLabel }
    }
    allContentfulValuePillar(sort: { order: ASC }) {
      nodes { title description }
    }
    allContentfulTestimonial(sort: { order: ASC }) {
      nodes {
        quote
        name
        role
        company
        photo { gatsbyImageData(width: 96, height: 96, placeholder: BLURRED) }
      }
    }
    allContentfulSiteSettings {
      nodes {
        name
        animatedList
        keyMetrics {
          label
          value
        }
        skills {
          category
          skills {
            name
            description
          }
        }
        tagline
        bio
        keyAchievements
        image {
          gatsbyImageData(
            layout: FULL_WIDTH
            placeholder: BLURRED
          )
        }
      }
    }
  }
`;
