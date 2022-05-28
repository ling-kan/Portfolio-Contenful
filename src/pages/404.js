import React from 'react';
import { graphql, navigate } from "gatsby"
import get from "lodash/get";
import Layout from "../components/layout";
import Container from '../components/container';
import Header from '../components/header';
import { ArrowNarrowLeftIcon } from '@heroicons/react/solid'

const PageNotFound = (props) => {
  const navigation = get(props, "data.allContentfulNavigation.nodes");
  const socials = get(props, "data.allContentfulSocials.nodes");

  return (
    <Layout location={props.location} navigation={navigation} socials={socials} >
      <div className="min-h-screen ">
        <Container>
          <button className="hover:text-blue-hover flex mb-2" onClick={(e) => { e.preventDefault(); navigate(-2) }}>
            <ArrowNarrowLeftIcon className="mr-2 my-auto h-5 w-5" />
            Back</button>
        </Container>
        <Container>
          <Header title="404 Page" style={{ textAlign: 'center' }} />
          <p>Oops, we couldn't find this page!</p>
        </Container>
      </div>
    </Layout>
  )
}

export default PageNotFound;

export const pageQuery = graphql`
  query PageNotFoundQuery {
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
  }
`;
