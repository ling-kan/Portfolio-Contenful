import React from 'react';
import Layout from "../components/layout";
import Container from '../components/container';
import { Link } from 'gatsby'
import Illustration from "../assets/illustration/vision.svg";

const PageNotFound = (props) => {
  return (
    <Layout location={props.location} fullHeaderHeight={true} >
      <Container className="min-h-screen flex m-auto pt-20 md:pt-6">
        <div className='block md:flex m-auto'>
          <div className='m-auto mr-0 md:w-6/12 w-full '>
            <h1 className="not-found-text text-9xl text-border uppercase text-center">
              404
            </h1>
            <p className='text-3xl text-center font-semibold'>Oops, we couldn't find this page</p>
            <Link to="/" type="button" className="my-6 mx-auto block w-6/12 rounded-full border border-border bg-transparent px-10 py-2 text-center text-foreground transition-colors hover:border-foreground hover:text-foreground">Home</Link>
          </div>
          <Illustration className="md:w-5/12 md:h-full h-fit w-full" />
        </div>
      </Container>
    </Layout>
  )
}

export default PageNotFound;
