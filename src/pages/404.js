import React from 'react';
import { graphql } from "gatsby"
import get from "lodash/get";
import Layout from "../components/layout";
import Container from '../components/container';
import { Link } from 'gatsby'
import Illustration from "../assets/illustration/vision.svg";

const PageNotFound = (props) => {
  const navigation = get(props, "data.allContentfulNavigation.nodes");
  const socials = get(props, "data.allContentfulSocials.nodes");

  return (
    <Layout location={props.location} navigation={navigation} socials={socials} fullHeaderHeight={true} >
      <Container className="min-h-screen flex m-auto pt-20 md:pt-6">
        <div className='block md:flex'>
          <div className='m-auto mr-0 md:w-6/12 w-full '>
            <h1 className="not-found-text text-9xl text-border uppercase text-center">
              404
            </h1>
            <p className='text-3xl text-center font-semibold'>Oops, we couldn't find this page</p>
            <Link to="/" className="my-6 block text-center mx-auto text-black btn-blue-hover py-2 px-10 w-6/12 border-2 border-solid border-black rounded-full">Home</Link>
          </div>
          <Illustration className="md:w-5/12 md:h-full h-fit w-full" />

        </div>
      </Container>

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
