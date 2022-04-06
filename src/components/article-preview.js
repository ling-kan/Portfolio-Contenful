import React from 'react'
import { Link } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'

import Container from './container'
import Tags from './tags'

const ArticlePreview = ({ posts }) => {
  if (!posts) return null
  if (!Array.isArray(posts)) return null

  return (
    <Container>
      <ul className="grid grid-cols-2 gap-3">
        {posts.map((post) => {
          return (

            <div key={post.slug} className="max-w-sm w-full md:max-w-full md:flex">
              <Link to={`/blog/${post.slug}`} >
                <div className="block lg:flex">
                  <GatsbyImage alt="" className="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden" image={post.heroImage.gatsbyImageData} />
                  <div className="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                    <div className="mb-8">
                      <p className="text-sm text-gray-600 flex items-center">
                        <svg className="fill-current text-gray-500 w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
                        </svg>
                        Members only
                      </p>
                      <div className="text-gray-900 font-bold text-xl mb-2">{post.title}</div>
                      <div className="text-gray-700 text-base"
                        dangerouslySetInnerHTML={{
                          __html: post.description.childMarkdownRemark.html,
                        }}
                      />
                    </div>
                    <div className="flex items-center">
                      <div className="text-sm">
                        <p className="text-gray-600">{post.publishDate}</p>
                        <Tags tags={post.tags} />
                      </div>
                    </div>
                  </div>
                </div>

              </Link>
            </div>



          )
        })}
      </ul>
    </Container >
  )
}

export default ArticlePreview
