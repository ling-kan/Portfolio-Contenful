import React from 'react'
import { Link } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
import Tags from './tags'

const ArticlePreview = ({ posts }) => {
  if (!posts) return null
  if (!Array.isArray(posts)) return null
  return (
    <ul className="grid grid-cols-2 gap-4">
      {posts.map((post) => {
        return (
          <Link to={`/portfolio/${post.slug}`} key={post.slug} className="flex flex-col items-center bg-white rounded-sm md:grid md:grid-cols-1 md:max-w-lg md:max-h-xl hover:opacity-70">
            <GatsbyImage alt="" className="object-cover w-full h-auto rounded-t-md md:h-full md:w-full md:max-w-50 rounded-b-none " image={post.heroImage.gatsbyImageData} />
            <div className="flex flex-col justify-between p-4 leading-normal md:col-span-2">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-dark">{post.title}</h5>
              <div className="mb-2 font-normal text-dark" dangerouslySetInnerHTML={{
                __html: post.description.childMarkdownRemark.html,
              }} />
              <div className="flex items-center">
                <div className="text-sm">
                  <p className="text-dark mb-2">{post.endDate}</p>
                  <Tags tags={post.tags} />
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </ul>
  )
}

export default ArticlePreview
