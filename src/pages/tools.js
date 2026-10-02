import React from 'react'
import { graphql } from 'gatsby'
import get from 'lodash/get'
import Seo from '../components/seo'
import Layout from '../components/layout'
import BlogHeader from '../components/blog-header'
import Container from '../components/container'
import ToolCard from '../components/tool-card'

const ToolsPage = (props) => {
    const card = get(props, "data.allContentfulTools.nodes");
    const header = get(props, "data.contentfulPageHeader") || {};
    return (
        <Layout location={props.location}>
            <Seo title={header.seoTitle || "Tools"} description={header.seoDescription || undefined} />
            <BlogHeader
                eyebrow={header.eyebrow || "Toolbox"}
                slot="toolsHeader"
                slotImage={header.headerImage?.gatsbyImageData}
                title={header.title || "Tools, experiments and resources."}
                content={header.intro || "Things I have built or rely on — shared in case they help you too."}
            />
            <Container className="pt-8 pb-24 md:pb-36">
                <ToolCard cards={card} />
            </Container>
        </Layout>
    )
}
export default ToolsPage

export const pageQuery = graphql`
  query ToolQuery {
  contentfulPageHeader(slug: { eq: "tools" }) {
    eyebrow
    title
    intro
    seoTitle
    seoDescription
    headerImage { gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED) }
  }
  allContentfulTools {
    nodes {
      createdAt(formatString: "DD MMMM YYYY")
      date(formatString: "DD MMMM YYYY")
      id
      link
      title
      tag
      updatedAt(formatString: "DD MMMM YYYY")
       description {
          childMarkdownRemark {
            html
          }
        }
      image {
        gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED)
      }
    }
  }
}


`;
