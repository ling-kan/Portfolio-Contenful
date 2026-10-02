import React from 'react'
import { Link } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
import { motion } from 'motion/react'
import Marquee from './motion/marquee'
import useSafeReducedMotion from './motion/use-safe-reduced-motion'

/**
 * Two counter-scrolling rows of project imagery.
 * Each tile goes from greyscale to colour on hover and links to its case study.
 */
const Tile = ({ post }) => (
  <Link
    to={`/portfolio/${post.slug}`}
    className="group relative block w-60 md:w-80 aspect-[16/10] shrink-0 rounded-2xl overflow-hidden bg-sand"
    aria-label={post.title}
  >
    <GatsbyImage
      image={post.heroImage.gatsbyImageData}
      alt=""
      className="w-full h-full grayscale-[85%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
      imgClassName="object-cover"
    />
    <span className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 rounded-full glass px-3 py-1.5 text-[0.7rem] font-medium !text-ink truncate">
      {post.title}
    </span>
  </Link>
)

const ImageReel = ({ posts = [] }) => {
  const reduce = useSafeReducedMotion()

  const items = posts.filter((p) => !p.hiddenPage && p.heroImage?.gatsbyImageData)
  if (items.length < 3) return null
  const half = Math.ceil(items.length / 2)
  const rows = [items.slice(0, half), items.slice(half).concat(items.slice(0, Math.max(0, half - (items.length - half))))]

  return (
    <section aria-label="Project gallery" className="relative py-16 md:py-20 overflow-hidden">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-5"
      >
        {rows.map((row, i) => (
          <Marquee key={i} duration={60 + i * 12} gap="1.25rem" reverse={i === 1}>
            {row.map((post) => (
              <Tile key={`${i}-${post.slug}`} post={post} />
            ))}
          </Marquee>
        ))}
      </motion.div>
    </section>
  )
}

export default ImageReel
