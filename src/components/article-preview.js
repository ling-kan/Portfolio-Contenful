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
            <Link to={`/portfolio/${post.slug}`} key={post.slug} className="flex flex-col items-center bg-white rounded-lg border shadow-md md:grid md:grid-cols-3 md:max-w-xl md:max-h-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-black dark:hover:bg-gray-700">
              <GatsbyImage alt="" className="object-cover w-full h-auto rounded-t-lg md:h-full md:w-full md:max-w-50 md:rounded-none md:rounded-l-lg" image={post.heroImage.gatsbyImageData} />
              <div className="flex flex-col justify-between p-4 leading-normal md:col-span-2">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{post.title}</h5>
                <div className="mb-3 font-normal text-gray-700 dark:text-gray-400" dangerouslySetInnerHTML={{
                  __html: post.description.childMarkdownRemark.html,
                }} />
                <div className="flex items-center">
                  <div className="text-sm">
                    <p className="text-gray-600">{post.publishDate}</p>
                    <Tags tags={post.tags} />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </ul>
    </Container >
  )
}

export default ArticlePreview
