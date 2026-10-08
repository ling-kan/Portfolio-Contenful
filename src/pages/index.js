import React from 'react'
import { graphql } from "gatsby";
import HomePage from '../components/home-page';

const RootIndex = (props) => <HomePage {...props} />

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
        protectPage
        headlineResult
        heroImage {
          gatsbyImageData(
            layout: CONSTRAINED
            placeholder: BLURRED
            width: 900
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
        bio {
          childMarkdownRemark {
            html
          }
        }
        icon {
          gatsbyImageData(
            layout: CONSTRAINED
            placeholder: BLURRED
            width: 80
            height: 40
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
            layout: CONSTRAINED
            placeholder: BLURRED
            width: 80
            height: 40
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
    allContentfulLanding(
      filter: { contentful_id: { eq: "5gcA2XyhjtzTDF0oz2Mz2" } }
    ) {
      nodes {
        name
        heroPrimaryCtaLabel
        heroSecondaryCtaLabel
        availability
        cvFile { url }
        valuePillarsLabel
        achievementsLabel
        logoStripLabel
        featuredProjectCount
        aboutImage { gatsbyImageData(layout: CONSTRAINED, placeholder: BLURRED, width: 1000) description }
        aboutImageCaption
        skillImage { gatsbyImageData(layout: CONSTRAINED, placeholder: BLURRED, width: 800) }
        contactImage { gatsbyImageData(layout: CONSTRAINED, placeholder: BLURRED, width: 800) description }
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
        bio {
          childMarkdownRemark {
            html
          }
        }
        keyAchievementsText

        image {
          gatsbyImageData(
            layout: CONSTRAINED
            placeholder: BLURRED
            width: 900
          )
        }
      }
    }
  }
`;
