import React, { useRef } from 'react'
import useSafeReducedMotion from './motion/use-safe-reduced-motion'
import { GatsbyImage } from 'gatsby-plugin-image'
import { motion, useScroll, useTransform } from 'motion/react'
import Container from './container'
import Tags from './tags'
import ImageSlot, { slotVisible } from './image-slot'
import { Reveal, SplitText, EASE } from './motion/reveal'

const BlogHeader = ({ title, eyebrow = 'Portfolio', content, rawDate, endDate, timeToRead, tags, image, slot, slotImage, children }) => {
  const ref = useRef(null)
  const reduce = useSafeReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])

  return (
    <header ref={ref} className="relative isolate overflow-hidden -mt-28 md:-mt-32 pt-36 md:pt-44 pb-12 md:pb-16">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute -top-40 right-0 w-[34rem] h-[34rem] rounded-full bg-mint/50 blur-[110px]" />
        <div className="absolute top-20 -left-40 w-[26rem] h-[26rem] rounded-full bg-accent-soft/70 blur-[110px]" />
      </div>

      <Container>
        <Reveal y={16}>
          <p className="eyebrow text-ink/75 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-accent" />
            {eyebrow}
          </p>
        </Reveal>
        <SplitText as="h1" text={title} animateOnMount className="display-lg block mt-6 max-w-5xl text-ink" />
        {content && (
          <Reveal delay={0.25}>
            <p className="lead mt-6 max-w-2xl text-ink/75">{content}</p>
          </Reveal>
        )}

        {(endDate || timeToRead || tags?.length > 0) && (
          <Reveal delay={0.35} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 pt-6 border-t border-line">
            {endDate && (
              <div>
                <p className="eyebrow !text-[0.7rem] text-ink/75">Date</p>
                <time dateTime={rawDate} className="font-medium text-ink">{endDate}</time>
              </div>
            )}
            {timeToRead && (
              <div>
                <p className="eyebrow !text-[0.7rem] text-ink/75">Reading time</p>
                <p className="font-medium text-ink">{timeToRead} min read</p>
              </div>
            )}
            {tags?.length > 0 && <Tags tags={tags} className="sm:ml-auto" />}
          </Reveal>
        )}
        {children}
      </Container>

      {image && (
        <Container className="mt-12 md:mt-16">
          <motion.div
            initial={reduce ? false : { clipPath: 'inset(10% 10% 10% 10% round 1.5rem)', opacity: 0 }}
            animate={{ clipPath: 'inset(0% 0% 0% 0% round 1.5rem)', opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
            className="relative aspect-[16/9] rounded-[1.5rem] overflow-hidden bg-sand"
          >
            <motion.div style={reduce ? undefined : { scale: imageScale, y: imageY }} className="absolute inset-0">
              <GatsbyImage image={image} alt={title} className="w-full h-full" imgClassName="object-cover" />
            </motion.div>
          </motion.div>
        </Container>
      )}

      {/* Optional AI artwork banner for index pages (see src/data/imagery.js) */}
      {!image && slot && slotVisible(slot, slotImage) && (
        <Container className="mt-12 md:mt-16">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
            className="relative aspect-[16/9] sm:aspect-[12/5] rounded-[1.5rem] overflow-hidden bg-sand"
          >
            <motion.div style={reduce ? undefined : { y: imageY }} className="absolute -top-[12%] bottom-0 inset-x-0">
              <ImageSlot slot={slot} image={slotImage} />
            </motion.div>
          </motion.div>
        </Container>
      )}
    </header>
  )
}

export default BlogHeader
