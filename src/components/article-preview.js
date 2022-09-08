import React from 'react'
import { Link } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
import styled from "styled-components"
import { ArrowNarrowRightIcon } from '@heroicons/react/solid'
import FadeIn from './motion/fade-in'

const ArticlePreviewWrapper = styled(Link)`
 background: var(--background);
  transition: 0.4s ease-out;
  .details {
    background: var(--primary);
    background: linear-gradient(
      360deg,
      var(--primary) 0%,
      var(--primary) 85%,
      rgba(202, 0, 255, 0) 100%
    );
  }
  .article-image {
    padding-bottom: 5rem;
  }
  &:hover {
    .gatsby-image-wrapper {
      opacity: 0.5;
    }
    .read-more {
      display: block;
    }
  }
`;

const ArticlePreview = ({ posts }) => {
  if (!posts) return null
  if (!Array.isArray(posts)) return null

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.filter(post => !post.hiddenPage).map((post) => {
        return (
          <FadeIn key={post.slug} >
            <ArticlePreviewWrapper to={`/portfolio/${post.slug}`} className='article items-center md:max-w-lg md:max-h-xl'>
              <div className='relative bg-primary rounded-md'>
                <div className='article-image'>
                  <GatsbyImage alt={post.title} className="z-0 image object-cover w-full h-auto rounded-md md:h-full md:w-full md:max-w-100" image={post.heroImage.gatsbyImageData} />
                </div>
                <div className="z-5 details absolute transition ease-in-out  left-0 bottom-0 w-full p-4 pt-8 leading-normal  ">
                  <div className="flex justify-between pb-2">
                    <p className="mb-auto mt-0 text-grey text-sm uppercase">{post.endDate}</p>
                  </div>
                  <h5 className="text-xl tracking-tight text-black">{post.title}</h5>
                  <div className='read-more hidden'>
                    <div className="description text-black text-sm" dangerouslySetInnerHTML={{
                      __html: post.description.childMarkdownRemark.html,
                    }} />
                    <p className="text-sm pt-4 text-grey hover:text-secondary inline-flex">Read more <ArrowNarrowRightIcon className="ml-1 my-auto h-3 w-3" /></p>
                  </div>

                </div>
              </div>
            </ArticlePreviewWrapper>
          </FadeIn>
        )
      })}
    </ul >
  )
}

export default ArticlePreview
