import React, { useRef } from 'react'
import useSafeReducedMotion from './motion/use-safe-reduced-motion'
import { motion, useScroll, useTransform } from 'motion/react'
import VisionIllustration from '../assets/illustration/vision.svg'

// Split markdown HTML into top-level blocks so each one can animate on its own.
const toBlocks = (html = '') => {
  const blocks = html.match(/<(p|ul|ol|blockquote|h[1-6])[\s>][\s\S]*?<\/\1>/g)
  // Only split if the blocks account for all of the content (no nested lists, tables, stray text...)
  const strip = (s) => s.replace(/\s+/g, '')
  return blocks && strip(blocks.join('')) === strip(html) ? blocks : [html]
}

const InkBlock = ({ html }) => {
  const ref = useRef(null)
  const reduce = useSafeReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'start 0.45'] })
  const opacity = useTransform(scrollYProgress, [0, 1], [0.18, 1])
  const x = useTransform(scrollYProgress, [0, 1], [24, 0])

  return (
    <motion.div
      ref={ref}
      style={reduce ? undefined : { opacity, x }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

const StoryAbout = ({ html }) => {
  const ref = useRef(null)
  const reduce = useSafeReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const artY = useTransform(scrollYProgress, [0, 1], [60, -60])
  const blobRotate = useTransform(scrollYProgress, [0, 1], [-20, 40])

  return (
    <div ref={ref} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
      <div className="lg:col-span-5 lg:sticky lg:top-28">
        <motion.figure
          style={reduce ? undefined : { y: artY }}
          className="relative rounded-[2rem] bg-sand overflow-hidden aspect-[4/3.4] grain"
        >
          <motion.div
            aria-hidden="true"
            style={reduce ? undefined : { rotate: blobRotate }}
            className="absolute -top-16 -right-16 w-72 h-72 rounded-[40%] bg-mint/70 blur-2xl"
          />
          <div aria-hidden="true" className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full bg-accent-soft blur-2xl" />
          <VisionIllustration className="relative w-full h-full p-6" aria-hidden="true" />
          <figcaption className="absolute bottom-5 left-6 right-6 flex justify-between eyebrow text-ink/60">
            <span>Fig. 01</span>
            <span>Seeing the bigger picture</span>
          </figcaption>
        </motion.figure>
      </div>

      <div className="lg:col-span-7 rich-text text-lg md:text-[1.375rem] leading-relaxed tracking-tight text-ink space-y-6 font-display">
        {toBlocks(html).map((block, i) => (
          <InkBlock key={i} html={block} />
        ))}
      </div>
    </div>
  )
}

export default StoryAbout
