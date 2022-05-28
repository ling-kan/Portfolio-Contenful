import React from 'react'
import { Link } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
// import Tags from './tags'
import styled from "styled-components"
import { ArrowNarrowRightIcon } from '@heroicons/react/solid'

const ArticlePreviewWrapper = styled(Link)`
 background: var(--white);
  transition: 0.4s ease-out;
  .details {
    background: var(--white);
    background: linear-gradient(
      360deg,
      var(--white) 0%,
      var(--white) 85%,
      rgba(202, 0, 255, 0) 100%
    );
  }
  .article-image {
    padding-bottom: 3.5rem;
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
      {posts.map((post) => {
        return (

          <ArticlePreviewWrapper to={`/portfolio/${post.slug}`} key={post.slug} className='article items-center bg-white rounded-md   md:max-w-lg md:max-h-xl'>
            <div className='relative'>
              <div className='article-image'>
                <GatsbyImage alt={post.title} className="z-0 image object-cover w-full h-auto rounded-md md:h-full md:w-full md:max-w-100" image={post.heroImage.gatsbyImageData} />
              </div>
              <div className="z-10 details absolute transition ease-in-out  left-0 bottom-0 w-full p-4 pt-8 leading-normal  ">
                <div className="flex justify-between">
                  <p className="mb-auto mt-0 text-black-fade text-sm uppercase">{post.endDate}</p>
                  {/* <Tags tags={post.tags} /> */}
                </div>
                <h5 className="text-xl font-bold tracking-tight text-black">{post.title}</h5>
                <div className='read-more hidden'>
                  <div className="description font-normal text-black text-sm" dangerouslySetInnerHTML={{
                    __html: post.description.childMarkdownRemark.html,
                  }} />
                  <Link to={`/portfolio/${post.slug}`} className="text-sm mt-2 text-black-fade hover:text-blue-hover flex">Read more <ArrowNarrowRightIcon className="ml-1 my-auto h-3 w-3" /></Link>
                </div>

              </div>
            </div>
          </ArticlePreviewWrapper>

        )
      })}
    </ul >
  )
}

export default ArticlePreview
