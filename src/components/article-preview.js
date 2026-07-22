import React from 'react'
import { Link } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRightIcon } from '@heroicons/react/24/solid'
import FadeIn from './motion/fade-in'

const EASE = [0.22, 1, 0.36, 1];

const RATIOS = [
  'aspect-[4/5]',
  'aspect-[4/3]',
  'aspect-[3/4]',
  'aspect-square',
  'aspect-[4/3]',
  'aspect-[3/4]',
  'aspect-[4/5]',
  'aspect-square',
];

const ArticlePreview = ({ posts }) => {
  const prefersReduced = useReducedMotion();

  if (!posts) return null
  if (!Array.isArray(posts)) return null

  const visiblePosts = posts.filter(post => !post.hiddenPage);
  const featuredPosts = visiblePosts.slice(0, 8);
  const archivePosts = visiblePosts.slice(8);

  return (
    <section
      id="portfolio"
      className="bg-primary px-6 pt-24 pb-28 text-primary-foreground sm:px-12 sm:pt-28 sm:pb-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/60">
              Selected Works
            </span>
            <motion.h2
              initial={prefersReduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mt-3 text-balance font-serif text-5xl font-semibold italic tracking-tight sm:text-6xl lg:text-7xl"
            >
              Visionary Projects
            </motion.h2>
          </div>
        </div>

        <div className="mt-14 gap-5 [column-fill:_balance] sm:columns-2 sm:gap-6 lg:columns-3">
          {featuredPosts.map((post, i) => (
            <FadeIn key={post.slug}>
              <motion.div
                initial={prefersReduced ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.06, ease: EASE }}
                className="group mb-5 block break-inside-avoid sm:mb-6"
              >
                <Link
                  to={`/portfolio/${post.slug}`}
                  className="block"
                  aria-label={`${post.title}${post.tags?.[0] ? ` — ${post.tags[0]}` : ''}`}
                >
                  <div className="relative overflow-hidden rounded-xl">
                    <GatsbyImage
                      alt={post.title}
                      image={post.heroImage.gatsbyImageData}
                      className={`w-full ${RATIOS[i % RATIOS.length]} object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />

                    <span className="absolute left-3 top-3 font-serif text-xs italic text-primary-foreground/80">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="absolute right-3 top-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-background/90 text-primary opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowUpRightIcon className="h-4 w-4" />
                    </span>

                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-primary-foreground/70">
                        {post.endDate}
                      </p>
                      <h3 className="mt-0.5 text-balance font-serif text-lg font-semibold leading-tight text-primary-foreground">
                        {post.title}
                      </h3>
                      {post.tags?.[0] && (
                        <p className="mt-1 translate-y-1 text-[11px] font-medium uppercase tracking-[0.12em] text-primary-foreground/0 transition-all duration-500 group-hover:translate-y-0 group-hover:text-primary-foreground/70">
                          {post.tags[0]}
                        </p>
                      )}
                      {post.description?.childMarkdownRemark?.html && (
                        <div
                          className="mt-2 hidden text-xs leading-relaxed text-primary-foreground/80 group-hover:block"
                          dangerouslySetInnerHTML={{
                            __html: post.description.childMarkdownRemark.html,
                          }}
                        />
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            </FadeIn>
          ))}
        </div>

        {archivePosts.length > 0 && (
          <div className="mt-20 border-t border-primary-foreground/20 pt-4">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/60">
              The Archive
            </span>
            <ul className="mt-4">
              {archivePosts.map((post, i) => (
                <motion.li
                  key={post.slug}
                  initial={prefersReduced ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.4, delay: (i % 4) * 0.04, ease: EASE }}
                >
                  <Link
                    to={`/portfolio/${post.slug}`}
                    className="group grid grid-cols-[1fr_auto] items-center gap-4 border-b border-primary-foreground/15 py-4 sm:grid-cols-[auto_1fr_auto]"
                    aria-label={`${post.title}${post.tags?.[0] ? ` — ${post.tags[0]}` : ''}, ${post.endDate}`}
                  >
                    <span className="hidden w-20 text-xs font-medium uppercase tracking-[0.14em] text-primary-foreground/50 sm:block">
                      {post.endDate}
                    </span>
                    <span className="font-serif text-lg transition-transform duration-300 group-hover:translate-x-2 sm:text-xl">
                      {post.title}
                    </span>
                    <span className="flex items-center gap-6">
                      {post.tags?.[0] && (
                        <span className="hidden text-xs font-medium uppercase tracking-[0.14em] text-primary-foreground/50 md:block">
                          {post.tags[0]}
                        </span>
                      )}
                      <ArrowUpRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

export default ArticlePreview
