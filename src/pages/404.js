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
    <Layout location={props.location} navigation={navigation} socials={socials} headerSpacing="0" >
      <Container className="min-h-screen flex m-auto">
        <div className='flex'>
          <div className='m-auto mr-0 w-6/12 md:w-12/12 '>
            <h1 style={{ fontSize: "12rem" }} className="text-9xl text-border uppercase text-center">
              404
            </h1>
            <p className='text-3xl text-center font-semibold'>Oops, we couldn't find this page</p>
            <Link to="/" className="my-6 block text-center mx-auto text-black hover:text-blue-hover hover:blue-border-hover py-2 px-10 w-6/12 border-2 border-solid border-black rounded-full">Home</Link>
          </div>
          <Illustration className="w-5/12 h-full md:w-12/12" />

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
