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
    return (
        <Layout location={props.location}>
            <Seo title="Tools" />
            <BlogHeader title="Tools" />
            <Container>
                <ToolCard cards={card} />
            </Container>
        </Layout>
    )
}
export default ToolsPage

export const pageQuery = graphql`
  query ToolQuery {
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
