import React from 'react';
import { Link } from 'gatsby'
import { ArrowLeftIcon } from '@heroicons/react/24/solid'
import Layout from "../components/layout";
import Container from '../components/container';
import { Reveal, SplitText } from '../components/motion/reveal'
import useSiteSettings from '../services/useSiteSettings'
import { GatsbyImage } from 'gatsby-plugin-image';

const PageNotFound = (props) => {
  const { notFoundTitle, notFoundButtonLabel, notFoundImage } = useSiteSettings();
  const hasNotFoundImage = Boolean(notFoundImage?.gatsbyImageData)
  return (
    <Layout location={props.location} fullHeaderHeight={true} >
      <section className="relative isolate overflow-hidden min-h-[100svh] flex items-center pt-28 pb-16">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="absolute -top-32 -right-24 w-[34rem] h-[34rem] rounded-full bg-mint/50 blur-[110px]" />
          <div className="absolute bottom-0 -left-40 w-[28rem] h-[28rem] rounded-full bg-accent-soft/70 blur-[110px]" />
        </div>
        <Container>
          <div className={`grid grid-cols-1 ${hasNotFoundImage ? 'lg:grid-cols-2' : ''} gap-12 items-center`}>
            <div>
              <p className="eyebrow text-ink/75">Error 404 — Page not found</p>
              <h1 className="not-found-text font-display !font-bold !tracking-tighter !leading-[0.9] text-outline text-ink mt-4">404</h1>
              <SplitText as="p" animateOnMount text={notFoundTitle} highlight={['found.']} className="display-md block text-ink mt-4" />
              <Reveal delay={0.08}>
                <Link to="/" className="group mt-10 inline-flex items-center gap-3 rounded-full bg-ink !text-paper px-6 py-3 font-medium hover:bg-accent transition-colors">
                  <ArrowLeftIcon className="w-4 h-4 no-fill fill-paper group-hover:-translate-x-1 transition-transform" />
                  {notFoundButtonLabel}
                </Link>
              </Reveal>
            </div>
            {hasNotFoundImage && (
              <Reveal delay={0.08}>
                <div className="mobile-image-frame relative aspect-[4/3]">
                  <GatsbyImage
                    image={notFoundImage.gatsbyImageData}
                    alt="404 illustration"
                    className="!absolute inset-0 w-full h-full"
                    imgClassName="object-cover"
                  />
                </div>
              </Reveal>
            )}
          </div>
        </Container>
      </section>
    </Layout>
  )
}

export default PageNotFound;
