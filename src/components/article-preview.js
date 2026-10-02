import React, { useRef, useState } from 'react'
import useSafeReducedMotion from './motion/use-safe-reduced-motion'
import { Link } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowUpRightIcon, LockClosedIcon } from '@heroicons/react/24/solid'
import { EASE } from './motion/reveal'

const ProjectCard = ({ post, index }) => {
  const ref = useRef(null)
  const reduce = useSafeReducedMotion()
  const [hover, setHover] = useState(false)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  const cx = useMotionValue(0)
  const cy = useMotionValue(0)
  const cursorX = useSpring(cx, { stiffness: 300, damping: 28 })
  const cursorY = useSpring(cy, { stiffness: 300, damping: 28 })

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    cx.set(e.clientX - rect.left)
    cy.set(e.clientY - rect.top)
  }

  const html = post.description?.childMarkdownRemark?.html

  return (
    <motion.li
      ref={ref}
      className={`list-none ${index % 2 === 1 ? 'md:mt-28' : ''}`}
      initial={reduce ? false : { opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, ease: EASE }}
    >
      <Link to={`/portfolio/${post.slug}`} className="group block !text-ink" aria-label={`Read case study: ${post.title}`}>
        <motion.div
          onMouseMove={onMove}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          initial={reduce ? false : { clipPath: 'inset(12% 12% 12% 12% round 2rem)' }}
          whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 2rem)' }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.3, ease: EASE }}
          className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-sand md:cursor-none"
        >
          {post.heroImage?.gatsbyImageData ? (
            <motion.div style={reduce ? undefined : { y: imageY }} className="absolute -inset-y-[10%] inset-x-0">
              <GatsbyImage
                image={post.heroImage.gatsbyImageData}
                alt={post.title}
                className="w-full h-full transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                imgClassName="object-cover"
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 bg-grid" />
          )}
          <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors duration-500" />

          <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
            <span className="glass rounded-full px-3 py-1.5 eyebrow !text-[0.65rem] text-ink">
              {String(index + 1).padStart(2, '0')}
            </span>
            {post.protectPage && (
              <span className="glass rounded-full px-3 py-1.5 eyebrow !text-[0.65rem] text-ink inline-flex items-center gap-1.5">
                <LockClosedIcon className="w-3 h-3 no-fill fill-ink" /> Private
              </span>
            )}
          </div>

          {/* Cursor-following call to action (pointer devices) */}
          {!reduce && (
            <motion.span
              aria-hidden="true"
              style={{ x: cursorX, y: cursorY }}
              animate={{ scale: hover ? 1 : 0, opacity: hover ? 1 : 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="hidden md:grid absolute top-0 left-0 -ml-12 -mt-12 w-24 h-24 place-items-center rounded-full bg-accent text-white text-sm font-medium pointer-events-none"
            >
              View case
            </motion.span>
          )}
        </motion.div>

        <div className="mt-6 flex items-start justify-between gap-6">
          <div className="min-w-0">
            <p className="eyebrow text-ink/50">
              {post.endDate}
              {post.tags?.length > 0 && <span className="text-ink/30"> · </span>}
              {post.tags?.slice(0, 2).join(' · ')}
            </p>
            <h3 className="mt-3 display-md !text-[clamp(1.6rem,2.6vw,2.25rem)] text-ink group-hover:text-accent transition-colors duration-300">
              {post.title}
            </h3>
            {html && (
              <div className="rich-text mt-3 text-ink/65 line-clamp-2 max-w-lg" dangerouslySetInnerHTML={{ __html: html }} />
            )}
          </div>
          <span className="shrink-0 grid place-items-center w-12 h-12 rounded-full border border-ink/20 group-hover:bg-ink group-hover:border-ink transition-all duration-500 group-hover:rotate-45">
            <ArrowUpRightIcon className="w-5 h-5 no-fill fill-ink group-hover:fill-paper transition-colors" />
          </span>
        </div>
      </Link>
    </motion.li>
  )
}

const ArticlePreview = ({ posts }) => {
  if (!Array.isArray(posts)) return null
  const visible = posts.filter((post) => !post.hiddenPage)

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-16 gap-y-16 p-0 m-0">
      {visible.map((post, index) => (
        <ProjectCard key={post.slug} post={post} index={index} />
      ))}
    </ul>
  )
}

export default ArticlePreview
